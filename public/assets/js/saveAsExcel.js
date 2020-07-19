function saveAsExcel(id, file)
        {
            var fileName = file + '-students-data.xlsx';
			
            var table_text="<table border='2px'><tr>"; //Table Intialization, CSS included
            var textRange; 
			var index=0; 
			var table = document.getElementById(id); // Read table using id
			/*
				Read Table Data and append to table_text
			*/
			
            for(index = 0 ; index < table.rows.length ; index++) 
              {     
                    table_text=table_text+table.rows[index].innerHTML+"</tr>";
                    
              }

              table_text=table_text+"</table>"; // table close
              table_text= table_text.replace(/<a[^>]*>|<\/a>/g, ""); //removes links embedded in <td>
              table_text= table_text.replace(/<img[^>]*>/gi,"");  //removes images embeded in <td>
              table_text= table_text.replace(/<input[^>]*>|<\/input>/gi, ""); //removes input tag elements

              var userAgent = window.navigator.userAgent; //check client user agent to determine browser
              var msie = userAgent.indexOf("MSIE "); // If it is Internet Explorer user Aget will have string MSIE
			  
			 if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
              {
				  //Since IE > 10 supports blob, check for blob support and use if we can
			  if (typeof Blob !== "undefined") {
					//Bolb Data is ArrayStorage, convert to array
					table_text = [table_text];
                    var blob = new Blob(table_text);
                    window.navigator.msSaveBlob(blob, ''+fileName);
                }
				else{
					//If Blob is unsupported, create an iframe in HTML Page, and call that blank iframe
                    
                    textArea.document.open("text/html", "replace");
                    textArea.document.write(table_text);
                    textArea.document.close();
                    textArea.focus();
                    textArea.document.execCommand("SaveAs", true, fileName); 
     
				}
			  }
              
				//Other Browsers		 
               else  
				   //Can use below statement if client machine has Excel Application installed
                   //window.open('data:application/vnd.ms-excel,' + encodeURIComponent(table_text));  
				   var a = document.createElement('a');
					//getting data from our div that contains the HTML table
					var data_type = 'data:application/vnd.ms-excel';
					var table_div = document.getElementById(id);
					var table_html = table_div.outerHTML.replace(/ /g, '%20');
					table_html = table_html.replace(/<a[^>]*>|<\/a>/g, "");
					a.href = data_type + ', ' + table_html;
        
        //setting the file name
					a.download = ''+fileName;
        //triggering the function
					a.click();
              
      }
