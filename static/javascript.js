function searchSubs() {
  // Declare variables
  var input, filter, tbody, tr, td, i;
  input = document.getElementById("search");
  filter = input.value.toUpperCase();
  tr = document.getElementsByClassName("accordion-toggle");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    subredditName = tr[i].getAttribute('id');
    if (subredditName.toUpperCase().indexOf(filter) > -1) {
      document.getElementById(subredditName).style.display = "";
      document.getElementById(subredditName + '-secondary').style.display = "";
    } else {
      document.getElementById(subredditName).style.display = "none";
      document.getElementById(subredditName + '-secondary').style.display = "none";
    }
  }
}

function clearSearch() {
  var search = document.getElementById("search");
  search.value = "";
  searchSubs();
  var collapsables = document.getElementsByClassName("collapse");
  collapsables[0].collapse('hide');
  for (i = 0; i < collapsables.length; i++) {
    collapsables[i].collapse('hide');
  }
}

function sortNum(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("main-table");
  rows = table.getElementsByTagName("tr");  
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */

  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 2); i = i + 2) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("td")[n];
      y = rows[i + 2].getElementsByTagName("td")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (Number(x.innerHTML) > Number(y.innerHTML)) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (Number(x.innerHTML) < Number(y.innerHTML)) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
      //console.log("Switching: " + shouldSwitch + " List: " + [x.innerHTML, y.innerHTML]);
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      
      rows[i].parentNode.insertBefore(rows[i + 2], rows[i]);
      rows[i].parentNode.insertBefore(rows[i + 3], rows[i + 1]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

function sortSubreddits() {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  var test = [];
  table = document.getElementById("main-table");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("tr");
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 2); i = i + 2) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("td")[2];
      y = rows[i + 2].getElementsByTagName("td")[2];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
      //console.log("Switching: " + shouldSwitch + " List: " + [x.innerHTML, y.innerHTML]);
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 2], rows[i]);
      rows[i].parentNode.insertBefore(rows[i + 3], rows[i + 1]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}
function sortRating() {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("main-table");
  rows = table.getElementsByTagName("tr");  
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */

  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 2); i = i + 2) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("td")[4];
      y = rows[i + 2].getElementsByTagName("td")[4];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.getAttribute('id') > y.getAttribute('id')) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.getAttribute('id') < y.getAttribute('id')) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
      //console.log("Switching: " + shouldSwitch + " List: " + [x.innerHTML, y.innerHTML]);
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      
      rows[i].parentNode.insertBefore(rows[i + 2], rows[i]);
      rows[i].parentNode.insertBefore(rows[i + 3], rows[i + 1]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}