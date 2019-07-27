
// Enterprise Folder
function entFolderCreate() {
    
    var bizName = document.getElementById("biz-name-input").value.trim();
    var currYear = new Date().getFullYear(); 
    var fileName = " - " + currYear + ": " + bizName; // User Input
    
    var uploadUrl = 'https://api.box.com/2.0/folders';
    var uploadHeader = {
        'Authorization': 'Bearer njmU875NmYxt0w1edQzFcGUcM4v300yf'
    };

    $.ajax({       
        url: uploadUrl,
        headers: uploadHeader,
        type:'POST',
        data: JSON.stringify({ name: fileName, parent: { id: '83025545413' } }),
        // Prevent JQuery from appending as querystring:
        cache: false,
        contentType: 'json',
        processData: false,
        success: function(data){ 
            appFolderCreate(data["id"]);
        },
        error: function(data){
            console.log("Enterprise Folder Create Error");
        }
    });
}

// Document Folder Creation
function appFolderCreate(folderId) {
    
    var fileName = "Application";
    var uploadUrl = 'https://api.box.com/2.0/folders';
    var uploadHeader = {
        'Authorization': 'Bearer njmU875NmYxt0w1edQzFcGUcM4v300yf'
    };

    $.ajax({       
        url: uploadUrl,
        headers: uploadHeader,
        type:'POST',
        data: JSON.stringify({ name: fileName, parent: { id: folderId } }),
        // Prevent JQuery from appending as querystring:
        cache: false,
        contentType: 'json',
        processData: false,
        success: function(data){ 
            // FUNC FROM BELOW GOES HERE
            fileUpload('1', data["id"]); 
            fileUpload('2', data["id"]); 
        },
        error: function(data){
            console.log("App Folder Create Error");
        }
    });

}


// function uploadFiles(appFolderID) {

//     for {var i=1; i<8; i++ }

//         if 
// }
// FUNC THAT ITERATES THROUGH FOLDERS 
//  IF VALUE != "" CALL fileUpload ON (ITERATOR, APP_FOLDER_ID)

// Get Application Number 
// function getAppNumber()
// {
//     var appNum = "0";
//     var uploadUrl = 'https://api.box.com/2.0/folders/80802264662?fields=tags';
//     var uploadHeader = {
//         'Authorization': 'Bearer ekvdWNS6XzZmi4nYFaAuI8nvRWVpa1kB'
//     };

//     $.ajax({       
//         url: uploadUrl,
//         headers: uploadHeader,
//         type:'GET',
//         cache: false,
//         contentType: 'json',
//         processData: false,
//         success: function(data){ 
//             if (data["tags"].length == 1) {
//                 appNum = data["tags"][0].replace(/\D/g,'').trim(); // Strip all non-digits 
//                 appNum = (parseInt(appNum, 10) + 1).toString(10); 
//                 console.log("AppNum Retreived: " + appNum);
//             }
//             return appNum; 
//         },
//         error: function(data){
//             console.log("AppNum Retreive Error");
//             return appNum; 
//         }
//     }); 
// }

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
        'Authorization': 'Bearer njmU875NmYxt0w1edQzFcGUcM4v300yf'
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
        // Create Enterprise Folder, Nested Doc Folder
        entFolderCreate();
    }));

    // Validations
    $('.custom-file-input').on('change', function(){
        var fileName = $(this).val().split("\\");
        var length = fileName.length; 
        $(this).next('.custom-file-label').html(fileName[length-1]);
    });

    $('#biz-name-input')[0].oninvalid = function () {
        this.setCustomValidity('Enter a name without using the special characters "/", "\\", ".", & ".." ');
    };
    $('#biz-name-input')[0].oninput= function () {
        this.setCustomValidity(""); 
    };
  
});
