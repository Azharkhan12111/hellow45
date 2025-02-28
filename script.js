function addIdea() {
    let title = document.getElementById('ideaTitle').value;
    let description = document.getElementById('ideaDescription').value;
    let checkboxes = document.querySelectorAll('.criteria input[type="checkbox"]:checked');
    let score = Array.from(checkboxes).reduce((acc, cb) => acc + parseInt(cb.value), 0);
    score += parseInt(document.getElementById('implementationTime').value);

    let table = document.getElementById('ideasTable');
    let row = table.insertRow(-1);
    row.insertCell(0).innerText = title;
    row.insertCell(1).innerText = description;
    row.insertCell(2).innerText = score;

    let actions = row.insertCell(3);
    actions.innerHTML = '<button onclick="editIdea(this)">Edit</button> <button onclick="deleteIdea(this)">Delete</button>';
}

function editIdea(btn) {
    let row = btn.parentNode.parentNode;
    document.getElementById('ideaTitle').value = row.cells[0].innerText;
    document.getElementById('ideaDescription').value = row.cells[1].innerText;
    row.parentNode.removeChild(row);
}

function deleteIdea(btn) {
    btn.parentNode.parentNode.remove();
}

function exportToExcel() {
    let table = document.getElementById('ideasTable');
    let rows = Array.from(table.rows).map(row => Array.from(row.cells).map(cell => cell.innerText));
    let csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'ideas.csv');
    document.body.appendChild(link);
    link.click();
}
