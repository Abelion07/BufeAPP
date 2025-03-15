fetch('http://localhost:8080/orders')
.then(response => response.json())
.then(data => {
    tablazatFeltoltes(data);
})

function tablazatFeltoltes(data) {
    data.forEach(element => {
        const tablazat = document.querySelector('.tablazat');

        const row = document.createElement('tr');
        row.innerHTML=`
            <td>${element.id}</td>
            <td>${element.megrendelo}</td>
            <td>${element.email}</td>
            <td>${element.termekneve}</td>
            <td>${element.create_time}</td>
            <td>${element.szunet}</td>
            <td>${element.kp}</td>
            <td>${element.db}</td>
            <td>${element.price}</td>
            <td>${element.Kész}</td>
            <td><button>Leadás</button></td>
        `

        tablazat.appendChild(row);
    });
}