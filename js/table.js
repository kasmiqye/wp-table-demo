const tableContainer = document.getElementById('tableContainer');

const tableElement = document.createElement('table');
tableElement.classList.add('data-table');

tableContainer.appendChild(tableElement);

const tableHead = document.createElement('thead');
const headRow = document.createElement('tr');

const columnTitles = ['Показатель', 'Текущий день', 'Вчера', 'Этот день недели'];

columnTitles.forEach(function (title) {
    const th = document.createElement('th');
    th.textContent = title;
    headRow.appendChild(th);
});

tableHead.appendChild(headRow);
tableElement.appendChild(tableHead);

const tableBody = document.createElement('tbody');

let openedChartRow = null;

tableData.forEach(function (rowData) {

    const rowElement = document.createElement('tr');

    rowElement.addEventListener('click', function() {
        if(openedChartRow) {
            openedChartRow.remove();
            openedChartRow = null;
        }
        const chartRow = document.createElement('tr');
        const chartCell = document.createElement('td');

        chartCell.colSpan = 4;
        chartRow.appendChild(chartCell);

        const canvas = document.createElement('canvas');
        chartCell.appendChild(canvas);
        chartCell.classList.add('chart-cell');

        rowElement.after(chartRow);
        openedChartRow = chartRow;

        new Chart(canvas, {
        type: "line",
        data: {
            labels: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
            datasets: [
                {
                    label: rowData.label,
                    data: rowData.chartData,
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {display: false},
                    grid: {display: false},
                    border: {display: true, width: 2, color: "black"}
                },
                y: {
                    ticks: {display: false},
                    grid: {display: false},
                    border: {display: true, width: 2, color: "black"}
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
        });
    })

    const nameCell = document.createElement('td');
    nameCell.textContent = rowData.label;

    const currentCell = document.createElement('td');
    currentCell.textContent = rowData.current;

    const yesterdayCell = document.createElement('td');

    if (rowData.yesterday > rowData.current) {
        yesterdayCell.classList.add('bg-negative');
    } else if (rowData.yesterday < rowData.current) {
        yesterdayCell.classList.add('bg-positive');
    }
    
    const differencePercent = ((rowData.current - rowData.yesterday)/rowData.yesterday) *100;
    const roundedPercent = Math.round(differencePercent);

    let percentText;

    if(differencePercent > 0) {
        percentText = `+${roundedPercent}%`;
    } else {
        percentText = `${roundedPercent}%`;
    }

    yesterdayCell.innerHTML = `
        <span class="yesterday-value">${rowData.yesterday}</span>
        <span class="percent-change ${roundedPercent >= 0 ? 'positive' : 'negative'}">${percentText}</span>
    `

    const weekCell = document.createElement('td');
    weekCell.textContent = rowData.week;

    if (rowData.week > rowData.current) {
        weekCell.classList.add('bg-negative');
    } else if (rowData.week < rowData.current) {
        weekCell.classList.add('bg-positive');
    }

    rowElement.appendChild(nameCell);
    rowElement.appendChild(currentCell);
    rowElement.appendChild(yesterdayCell);
    rowElement.appendChild(weekCell);

    tableBody.appendChild(rowElement);
});

tableElement.appendChild(tableBody);