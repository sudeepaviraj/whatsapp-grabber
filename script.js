var numbers =  document.evaluate('//*[@id="main"]/header/div[2]/div[2]/span', document, null,  XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
var number_list = numbers.title.split(",")
var group_name =  document.evaluate('//*[@id="main"]/header/div[2]/div[1]/div/span', document, null,  XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent
var exportfile = "data:text/csv;charset=utf-8,"
number_list.map(number=>{
    try
    {
        exportfile += number.replace(" ","")+"\n"
    }
    catch
    {

    }
    }
)
var encodedUri = encodeURI(exportfile);
var link = document.createElement("a");
link.setAttribute("href", encodedUri);
link.setAttribute("download", `${group_name}.csv`);
document.body.appendChild(link);
link.click()
