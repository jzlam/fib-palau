
// App Folder Creation
function appFolderCreate() {
    
    var appNum = getAppNumber(); // Returns 0 if none indicated 
    var bizName = document.getElementById("biz-name-input").value.trim();
    var currYear = new Date().getFullYear(); 
    var fileName = appNum + " - " + currYear + ": " + bizName; // Inject User Input
    
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
        success: function(data){ 
            docFolderCreate(data["id"]);
        },
        error: function(data){
            console.log("App Folder Create Error");
        }
    });
}

// Document Folder Creation
function docFolderCreate(folderId) {
    
    var fileName = "Application";
    var uploadUrl = 'https://api.box.com/2.0/folders';
    var uploadHeader = {
        'Authorization': 'Bearer ekvdWNS6XzZmi4nYFaAuI8nvRWVpa1kB'
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
            fileUpload('1', data["id"]); 
            fileUpload('2', data["id"]); 
        },
        error: function(data){
            console.log("Doc Folder Create Error");
        }
    });

}

// Get Application Number 
function getAppNumber()
{
    var appNum = "0";
    var uploadUrl = 'https://api.box.com/2.0/folders/80802264662?fields=tags';
    var uploadHeader = {
        'Authorization': 'Bearer ekvdWNS6XzZmi4nYFaAuI8nvRWVpa1kB'
    };

    $.ajax({       
        url: uploadUrl,
        headers: uploadHeader,
        type:'GET',
        cache: false,
        contentType: 'json',
        processData: false,
        success: function(data){ 
            if (data["tags"].length == 1) {
                appNum = data["tags"][0].replace(/\D/g,'').trim(); // Strip all non-digits 
                appNum = (parseInt(appNum, 10) + 1).toString(10); 
                console.log("AppNum Retreived: " + appNum);
            }
            return appNum; 
        },
        error: function(data){
            console.log("AppNum Retreive Error");
            return appNum; 
        }
    }); 
}

// // Increment Application Number 
// function incrementAppNum(appNum) {

//     var uploadUrl = 'https://api.box.com/2.0/folders/81926499924';
//     var uploadHeader = {
//         'Authorization': 'Bearer ekvdWNS6XzZmi4nYFaAuI8nvRWVpa1kB'
//     };

//     $.ajax({       
//         url: uploadUrl,
//         headers: uploadHeader,
//         type:'PUT',
//         data: JSON.stringify({ name: appNum }),
//         cache: false,
//         contentType: 'json',
//         processData: false,
//         success: function(data){ 
//             console.log("AppNum Updated");
//         },
//         error: function(data){
//             console.log("AppNum Update Error");
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
        appFolderCreate();
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

    $('#biz-name-input')[0].oninvalid = function () {
        this.setCustomValidity('Enter a name without using the special characters "/", "\\", ".", & ".." ');
    };
    $('#biz-name-input')[0].oninput= function () {
        this.setCustomValidity(""); 
    };
  
});
