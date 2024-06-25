<?php

  function IfEquals($value, $expectedValue, $output) {
    if ( $value == $expectedValue ) {
      return $output;
    }
    return "";
  }

  function RestrictToValues($value, $possibleValues) {
    if ( !in_array($value, $possibleValues) ) {
      return $possibleValues[0];
    }
    return $value;
  }

  $nutzungen   = RestrictToValues( (int)$_REQUEST["nutzungen"],   [1,2,3,6,9,10]);
  $mitarbeiter = RestrictToValues( (int)$_REQUEST["mitarbeiter"], [1,2,3,6,9,10]);
  $extern      = RestrictToValues( (int)$_REQUEST["extern"],      [1,4,6,10]);
  $workaround  = RestrictToValues( (int)$_REQUEST["workaround"],  [1,5,10]);
  $ersparnis   = RestrictToValues( (int)$_REQUEST["ersparnis"],   [1,2,3,4,5,6,7,8,9,10]);
  $risiko      = RestrictToValues( (int)$_REQUEST["risiko"],      [1,3,5,7,9,10]);

  $zieleAusRequest = $_REQUEST["ziel"];
  if ($zieleAusRequest == null) 
    $zieleAusRequest = array();
  $ziel1 = in_array("1", $zieleAusRequest);
  $ziel2 = in_array("2", $zieleAusRequest);
  $ziel3 = in_array("3", $zieleAusRequest);
  $ziel4 = in_array("4", $zieleAusRequest);

  $entscheider = RestrictToValues( (int)$_REQUEST["entscheider"], [1,2,3,4,5]);

  $ziele = 0;
  if ( $ziel1 ) { $ziele += 1; }
  if ( $ziel2 ) { $ziele += 1; }
  if ( $ziel3 ) { $ziele += 1; }
  if ( $ziel4 ) { $ziele += 1; }
  // Es gibt eine Reihe von Situationen, in der wir Ziele nicht bewerten
  if ( $ziele == 0 ) { $ziele = 1; }

  $zielpunkte = 0;
  if ( $ziele == 1 ) { $zielpunkte = 1;   }
  if ( $ziele == 2 ) { $zielpunkte = 5;   }
  if ( $ziele == 3 ) { $zielpunkte = 7.5; }
  if ( $ziele == 4 ) { $zielpunkte = 10;  }

  $risikoWert = 1; // unbewertet
  if ($risiko > 1) {
	  $risikoWert = $risiko / 10.0;
  }
  $nutzen = $nutzungen * $mitarbeiter * $extern * $workaround * $ersparnis * $zielpunkte * $risikoWert;
  
  switch ($entscheider) {
    case 1 : 
      $nutzen += 0;
      break;
    case 2 :
      $nutzen += 500;
      break;
    case 3 :
      $nutzen += 1000;
      break;  
    case 4 :
      $nutzen += 1000;
      break;  
    case 5 :
      $nutzen += 2000;
      break;  
  }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Prio-Helper</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div class="container mt-5">
        <h1 class="mb-4">Priorisierungshelfer</h1>
        
        <div class="row">
            <div class="col-md-8">
                <form method="get">
                    <div class="mb-3">
                        <label for="nutzungen" class="form-label"><strong>Nutzen</strong></label>
                        <select name="nutzungen" id="nutzungen" class="form-select">
                            <option value="1"  <?php echo IfEquals($nutzungen,  1, "selected"); ?>>bis 1</option>
                            <option value="2"  <?php echo IfEquals($nutzungen,  2, "selected"); ?>>bis 5</option>
                            <option value="3"  <?php echo IfEquals($nutzungen,  3, "selected"); ?>>bis 10</option>
                            <option value="6"  <?php echo IfEquals($nutzungen,  6, "selected"); ?>>bis 50</option>
                            <option value="9"  <?php echo IfEquals($nutzungen,  9, "selected"); ?>>bis 100</option>
                            <option value="10" <?php echo IfEquals($nutzungen, 10, "selected"); ?>>&gt;100 oder es ist gesetzlich notwendig</option>
                        </select>
                    </div>
                    
                    <div class="mb-3">
                        <label for="mitarbeiter" class="form-label">Anzahl der betroffenen MA insg.</label>
                        <select name="mitarbeiter" id="mitarbeiter" class="form-select">
                            <option value="1"  <?php echo IfEquals($mitarbeiter,  1, "selected"); ?>>bis 1</option>
                            <option value="2"  <?php echo IfEquals($mitarbeiter,  2, "selected"); ?>>bis 5</option>
                            <option value="3"  <?php echo IfEquals($mitarbeiter,  3, "selected"); ?>>bis 10</option>
                            <option value="6"  <?php echo IfEquals($mitarbeiter,  6, "selected"); ?>>bis 25</option>
                            <option value="9"  <?php echo IfEquals($mitarbeiter,  9, "selected"); ?>>bis alle</option>
                            <option value="10" <?php echo IfEquals($mitarbeiter, 10, "selected"); ?>>es ist gesetzlich notwendig oder es sind Externe involviert</option>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="extern" class="form-label">Anzahl der DIREKT betroffenen Kunden/Externen</label>
                        <select name="extern" id="extern" class="form-select">
                            <option value="1"  <?php echo IfEquals($extern,  1, "selected"); ?>>bis 1</option>
                            <option value="4"  <?php echo IfEquals($extern,  4, "selected"); ?>>mehrere</option>
                            <option value="6"  <?php echo IfEquals($extern,  6, "selected"); ?>>alle benötigen es, aber nicht alle haben es</option>
                            <option value="10" <?php echo IfEquals($extern, 10, "selected"); ?>>alle, wirklich alle</option>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="workaround" class="form-label">Workaround vorhanden</label>
                        <select name="workaround" id="workaround" class="form-select">
                            <option value="1"  <?php echo IfEquals($workaround,  1, "selected"); ?>>nicht nötig</option>
                            <option value="5"  <?php echo IfEquals($workaround,  5, "selected"); ?>>ja</option>
                            <option value="10" <?php echo IfEquals($workaround,  10, "selected"); ?>>nein</option>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="ersparnis" class="form-label">Ersparnis oder zs. Gewinn pro Monat insg. höchster Skalenpunkt zählt</label>
                        <select name="ersparnis" id="ersparnis" class="form-select">
                            <option value="1"  <?php echo IfEquals($ersparnis,  1, "selected"); ?>>0min; 0 EUR</option>
                            <option value="2"  <?php echo IfEquals($ersparnis,  2, "selected"); ?>>bis 30min; 200 EUR</option>
                            <option value="3"  <?php echo IfEquals($ersparnis,  3, "selected"); ?>>bis 1h; 400 EUR</option>
                            <option value="4"  <?php echo IfEquals($ersparnis,  4, "selected"); ?>>bis 2h; 800 EUR</option>
                            <option value="5"  <?php echo IfEquals($ersparnis,  5, "selected"); ?>>bis 4h; 1600 EUR</option>
                            <option value="6"  <?php echo IfEquals($ersparnis,  6, "selected"); ?>>bis 8h; 3200 EUR</option>
                            <option value="7"  <?php echo IfEquals($ersparnis,  7, "selected"); ?>>bis 16h; 6400 EUR</option>
                            <option value="8"  <?php echo IfEquals($ersparnis,  8, "selected"); ?>>bis 32h; 12800 EUR</option>
                            <option value="9"  <?php echo IfEquals($ersparnis,  9, "selected"); ?>>&gt;32h; 12800 EUR</option>
                            <option value="10" <?php echo IfEquals($ersparnis, 10, "selected"); ?>>Hilft SWE beim schneller sein</option>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label class="form-label"><strong>Entspricht unseren Zielen</strong></label>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" name="ziel[]" value="1" <?php echo IfEquals($ziel1, true, "checked"); ?> id="ziel1">
                            <label class="form-check-label" for="ziel1">Mahr EDV ist der Top-Arbeitgeber in Deutschland</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" name="ziel[]" value="2" <?php echo IfEquals($ziel2, true, "checked"); ?> id="ziel2">
                            <label class="form-check-label" for="ziel2">Mahr EDV ist das Top-Dienstleistungssystemhaus in Deutschland</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" name="ziel[]" value="3" <?php echo IfEquals($ziel3, true, "checked"); ?> id="ziel3">
                            <label class="form-check-label" for="ziel3">Mahr EDV hat die top Cloud- und Managed-Angebote</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" name="ziel[]" value="4" <?php echo IfEquals($ziel4, true, "checked"); ?> id="ziel4">
                            <label class="form-check-label" for="ziel4">Wir wachsen auf 250 Mitarbeiter und 9+ Standorte</label>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="entscheider" class="form-label"><strong>Entscheider-Prio</strong></label>
                        <select name="entscheider" id="entscheider" class="form-select">
                            <option value="1" <?php echo IfEquals($entscheider, 1, "selected"); ?>>Keine Prio</option>
                            <option value="2" <?php echo IfEquals($entscheider, 2, "selected"); ?>>Pascal, normale E-Mail</option>
                            <option value="3" <?php echo IfEquals($entscheider, 3, "selected"); ?>>Pascal, rotes Ausrufezeichen / besonders wichtig</option>
                            <option value="4" <?php echo IfEquals($entscheider, 4, "selected"); ?>>Fabian, normale E-Mail</option>
                            <option value="5" <?php echo IfEquals($entscheider, 5, "selected"); ?>>Fabian, rotes Ausrufezeichen / besonders wichtig</option>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="risiko" class="form-label"><strong>Bei Risken: Risiko-Eintrittswahrscheinlichkeit</strong></label>
                        <select name="risiko" id="risiko" class="form-select">
                            <option value="1"  <?php echo IfEquals($risiko,  1, "selected"); ?>>nicht bewertet</option>
                            <option value="3"  <?php echo IfEquals($risiko,  3, "selected"); ?>>vielleicht in den nächsten Jahren</option>
                            <option value="5"  <?php echo IfEquals($risiko,  5, "selected"); ?>>vielleicht im nächsten Jahr</option>
                            <option value="7"  <?php echo IfEquals($risiko,  7, "selected"); ?>>vielleicht im den nächsten Monaten</option>
                            <option value="9"  <?php echo IfEquals($risiko,  9, "selected"); ?>>vielleicht im nächsten Monat</option>
                            <option value="10" <?php echo IfEquals($risiko, 10, "selected"); ?>>Mit absoluter Sicherheit / System steht</option>
                        </select>
                    </div>

                    <button type="submit" class="btn btn-primary">Berechnen</button>
                </form>

                <?php if ($nutzen > 0) { ?>
                    <div class="mt-4">
                        <h3>Ergebnis</h3>
                        <p>Die Priorität beträgt: <strong id="priorityDisplay"><?php echo $nutzen; ?></strong></p>
                    </div>
                <?php } ?>
            </div>
            <div class="col-md-4">
                <canvas id="prioChart"></canvas>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        const ctx = document.getElementById('prioChart').getContext('2d');
        let prioChart;

        function updatePriorityAndChart() {
            const nutzungen = parseInt(document.getElementById('nutzungen').value);
            const mitarbeiter = parseInt(document.getElementById('mitarbeiter').value);
            const extern = parseInt(document.getElementById('extern').value);
            const workaround = parseInt(document.getElementById('workaround').value);
            const ersparnis = parseInt(document.getElementById('ersparnis').value);
            const zieleChecked = document.querySelectorAll('input[name="ziel[]"]:checked').length;
            const entscheider = parseInt(document.getElementById('entscheider').value);
            const risiko = parseInt(document.getElementById('risiko').value);

            // Calculate priority (using the original PHP logic)
            let ziele = zieleChecked;
            if (ziele === 0) ziele = 1;
            let zielpunkte = 0;
            if (ziele === 1) zielpunkte = 1;
            if (ziele === 2) zielpunkte = 5;
            if (ziele === 3) zielpunkte = 7.5;
            if (ziele === 4) zielpunkte = 10;

            const risikoWert = risiko > 1 ? risiko / 10.0 : 1;
            let prio = nutzungen * mitarbeiter * extern * workaround * ersparnis * zielpunkte * risikoWert;
            
            switch (entscheider) {
                case 2: prio += 500; break;
                case 3: prio += 1000; break;
                case 4: prio += 1000; break;
                case 5: prio += 2000; break;
            }

            // Update priority display
            const priorityDisplay = document.getElementById('priorityDisplay');
            if (priorityDisplay) {
                priorityDisplay.textContent = prio.toFixed(2);
            } else {
                const resultDiv = document.createElement('div');
                resultDiv.className = 'mt-4';
                resultDiv.innerHTML = `
                    <h3>Ergebnis</h3>
                    <p>Die Priorität beträgt: <strong id="priorityDisplay">${prio.toFixed(2)}</strong></p>
                `;
                document.querySelector('form').insertAdjacentElement('afterend', resultDiv);
            }

            // Update chart (using the modified calculation for visualization purposes)
            const chartZiele = zieleChecked === 0 ? 0 : zieleChecked === 1 ? 2.5 : zieleChecked === 2 ? 5 : zieleChecked === 3 ? 7.5 : 10;
            
            if (prioChart) {
                prioChart.data.datasets[0].data = [nutzungen, mitarbeiter, extern, workaround, ersparnis, chartZiele, entscheider, risiko];
                prioChart.update();
            } else {
                prioChart = new Chart(ctx, {
                    type: 'radar',
                    data: {
                        labels: ['Nutzen', 'Mitarbeiter', 'Extern', 'Workaround', 'Ersparnis', 'Ziele', 'Entscheider', 'Risiko'],
                        datasets: [{
                            label: 'Priorität',
                            data: [nutzungen, mitarbeiter, extern, workaround, ersparnis, chartZiele, entscheider, risiko],
                            fill: true,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgb(255, 99, 132)',
                            pointBackgroundColor: 'rgb(255, 99, 132)',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: 'rgb(255, 99, 132)'
                        }]
                    },
                    options: {
                        elements: {
                            line: {
                                borderWidth: 3
                            }
                        },
                        scales: {
                            r: {
                                angleLines: {
                                    display: true
                                },
                                suggestedMin: 0,
                                suggestedMax: 10
                            }
                        }
                    }
                });
            }
        }

        // Automated URL update and priority/chart update
        document.querySelectorAll('select, input[type="checkbox"]').forEach(element => {
            element.addEventListener('change', function() {
                const form = this.closest('form');
                const formData = new FormData(form);
                const searchParams = new URLSearchParams(formData);
                const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
                window.history.pushState({}, '', newUrl);
                updatePriorityAndChart();
            });
        });

        // Initial priority and chart update
        updatePriorityAndChart();
    </script>
</body>
</html>
