function saveAsCSV(id, file) {
  var filename = file + "-students-data.csv";
  // Variable to store the final csv data
  var csv_data = [];

  // Get each row data
  var rows = document.getElementById(id).getElementsByTagName("tr");

  for (var i = 0; i < rows.length; i++) {
    // Get each column data
    var cols = rows[i].querySelectorAll("td,th");

    // Stores each csv row data
    var csvrow = [];
    for (var j = 0; j < cols.length; j++) {
      // Get the text data of each cell of
      // a row and push it to csvrow
      var element;
      element = cols[j].innerText.trim().replace(/<a[^>]*>|<\/a>/g, ""); //removes links embedded in <td>
      element = element.replace(/<img[^>]*>/gi, ""); //removes images embeded in <td>
      element = element.replace(/<input[^>]*>|<\/input>/gi, ""); //removes input tag elements
      element = element.replace(/<button[^>]*>|<\/button>/gi, ""); //removes button tag elements
      element = element.replace(/<i[^>]*>|<\/i>/gi, ""); //removes i tag elements
      element = element.replace(/<\/?span[^>]*>/g, ""); //removes the span tag elements
      csvrow.push(element);
    }

    // Combine each column value with comma
    csv_data.push(csvrow.join(","));
  }
  // combine each row data with new line character
  csv_data = csv_data.join("\n");

  //Create CSV file object and feed our
  //csv_data into it
  CSVFile = new Blob([csv_data], { type: "text/csv" });

  var temp_link = document.createElement("a");

  // Download csv file
  temp_link.download = filename;
  var url = window.URL.createObjectURL(CSVFile);
  temp_link.href = url;

  // This link should not be displayed
  temp_link.style.display = "none";
  document.body.appendChild(temp_link);

  // Automatically click the link to trigger download
  temp_link.click();
  document.body.removeChild(temp_link);
}
