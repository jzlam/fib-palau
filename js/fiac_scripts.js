
// App Folder Creation
function folderCreate() {
    
    var appNum = getAppNumber();
    var bizName = document.getElementById("biz-name-input").value.trim();
    var currYear = new Date().getFullYear(); 
    var fileName = appNum. + " - " + currYear + ": " + bizName; // Inject User Input
    
    var uploadUrl = 'https://api.box.com/2.0/folders';
    var uploadHeader = {
        'Authorization': 'Bearer ekvdWNS6XzZmi4nYFaAuI8nvRWVpa1kB'
    };

    $.ajax({       
        url: uploadUrl,
        headers: uploadHeader,
        type:'POST',
        data: JSON.stringify({ name: fileName, parent: { id: '80802264662' } }),
        // Prevent JQuery from appending as querystring:
        cache: false,
        contentType: 'json',
        processData: false,
        // Feedback: 
        // beforeSend: function(xhr) {
        //     xhr.setRequestHeader('Authorization', 'Bearer ' + window.token);
        // },
        success: function(data){ 
            console.log("-----------------");
            console.log("Data[id]:");
            console.log(data['id']);
            console.log("-----------------");

            fileUpload('1', data['id']); 
            fileUpload('2', data['id']); 
        },
        error: function(data){
            console.log("Folder Create Error");
        }
    });

}

// AppNum (Incoming Apps check)
function getAppNumber()
{
    var appNum = "0"
    var uploadUrl = 'https://api.box.com/2.0/folders/80802264662/items';
    var uploadHeader = {
        'Authorization': 'Bearer ekvdWNS6XzZmi4nYFaAuI8nvRWVpa1kB'
    };

    $.ajax({       
        url: uploadUrl,
        headers: uploadHeader,
        type:'GET',
        data: JSON.stringify({ sort: "name", direction: "DESC", limit: "1"}), // Folders always listed first (ASC)
        cache: false,
        contentType: 'json',
        processData: false,
        success: function(data){ 
            if (data["entries"].length == 0) {
                console.log("Incoming Apps EMPTY");
                appNum = getAppNumberFallback();
                return appNum;
            } else {
                console.log("AppNum Success");
                console.log("-----------");
                console.log(data);
                console.log(data["entries"]);
                console.log(data["entries"][0]);
                console.log(data["entries"][0]["name"].split("-")[0].trim());
                console.log("-----------");
                appNum = data["entries"][0]["name"].split("-")[0].trim();
                appNum = (parseInt(appNum, 10) + 1); // Increment
                return appNum; 
            }
        },
        error: function(data){
            console.log("AppNum Error");
            return appNum; 
        }
    }); 
}

// AppNum (FIAC check)
function getAppNumberFallback() {
    var appNum = "0"
    var uploadUrl = 'https://api.box.com/2.0/folders/80361855716/items';
    var uploadHeader = {
        'Authorization': 'Bearer ekvdWNS6XzZmi4nYFaAuI8nvRWVpa1kB'
    };

    $.ajax({       
        url: uploadUrl,
        headers: uploadHeader,
        type:'GET',
        data: JSON.stringify({ sort: "name", direction: "DESC", limit: "1"}),
        cache: false,
        contentType: 'json',
        processData: false,
        success: function(data){ 
            if (data["entries"].length == 0) {
                return appNum;
            } else {
                console.log("AppNumFallback Success");
                console.log(data["entries"][0]["name"].split("-")[0].trim());
                appNum = data["entries"][0]["name"].split("-")[0].trim();
                appNum = (parseInt(appNum, 10) + 1); // Increment
                return appNum; 
            }
        },
        error: function(data){
            console.log("AppNum Error");
            return appNum; 
        }
    });
}

// File Upload
function fileUpload(elementId, parentId) {
    var selectorId =  "fiac-select" + elementId;

    var fileSelect = document.getElementById(selectorId);
    var file = fileSelect.files[0];
    
    var formData = new FormData();
    formData.append(file.name, file, file.name); // Selected File
    formData.append('parent_id', parentId); // Parent

    // API 
    var uploadUrl = 'https://upload.box.com/api/2.0/files/content'; 
    var uploadHeader = {
        'Authorization': 'Bearer ekvdWNS6XzZmi4nYFaAuI8nvRWVpa1kB'
    };

    $.ajax({       
        url: uploadUrl,
        headers: uploadHeader,
        type:'POST',
        data: formData,
        // Prevent JQuery from appending as querystring:
        cache: false,
        contentType: false,
        processData: false,
        // Feedback: 
        success: function(data) { 
            console.log("Upload Succes (F" + elementId + "):");
        },
        error: function(data){
            console.log("Upload Error (F" + elementId + "):");
        }
    });
}

// Master Script Start
$(document).ready(function (e) {

    // Form Submit
    $('#fiac-upload-form').on('submit',(function(e) {
        // Prevent default form submission
        e.preventDefault();
        // Create Application Folder, Nested Doc Folder
        folderCreate();
    }));

    // Validations
    $('#fiac-select1').on('change', function(){
        var fileName = $(this).val();
        $(this).next('.custom-file-label').html(fileName);
    });
    $('#fiac-select2').on('change', function(){
        var fileName = $(this).val();
        $(this).next('.custom-file-label').html(fileName);
    });

    $('biz-name-input')[0].oninvalid = function () {
        this.setCustomValidity("Enter only letters, numbers, and hyphens.");
    };
    $('biz-name-input')[0].oninput= function () {
        this.setCustomValidity("");
    };
  
});
