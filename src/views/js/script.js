document.addEventListener('DOMContentLoaded', async () => {
    try {
      const users = await fetch('/users').then(res => res.json());
      const companies = await fetch('/companies').then(res => res.json());
      const classes = await fetch('/classes').then(res => res.json());
  
      const usersTable = document.getElementById('users-table');
      users.forEach(user => {
        const row = usersTable.insertRow();
        row.insertCell(0).innerText = user.id;
        row.insertCell(1).innerText = user.name;
        row.insertCell(2).innerText = user.email;
      });
  
      const companiesTable = document.getElementById('companies-table');
      companies.forEach(company => {
        const row = companiesTable.insertRow();
        row.insertCell(0).innerText = company.id;
        row.insertCell(1).innerText = company.name;
      });
  
      const classesTable = docusersusersument.getElementById('classes-table');
      classes.forEach(cls => {
        const row = classesTable.insertRow();
        row.insertCell(0).innerText = cls.id;
        row.insertCell(1).innerText = cls.name;
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  });
  