document.addEventListener('DOMContentLoaded', function () {
    const dropdownButton = document.getElementById('dropdownMenuButton1');
    const dropdownMenu = document.querySelector('.dropdown-menu');
  
    dropdownButton.addEventListener('click', function () {
      dropdownMenu.classList.toggle('show');
    });
  
    window.addEventListener('click', function (event) {
      if (!event.target.matches('#dropdownMenuButton1')) {
        if (dropdownMenu.classList.contains('show')) {
          dropdownMenu.classList.remove('show');
        }
      }
    });
  });