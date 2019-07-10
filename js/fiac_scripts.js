
// Script: 

// -folderCreate(nestedFolderCreate) 
//     -nestedFolderCreate(fileUpload("1", "xhr[]", ))



// Sucess / Fallthrough Functions 

var nestedFolderCreate = function(xhr)
{
    console.log("App Folder Created:");
    console.log(xhr['entries'][0]['id']);

    fileUpload('1', xhr['entries'][0]['id']); 
    fileUpload('2', xhr['entries'][0]['id']); 
}


function folderCreate() {
    
    var bizName = document.getElementById("biz-name-input").value.trim();
    var currYear = new Date().getFullYear(); 
    var fileName = "No. - " + currYear + ": " + bizName; // Inject User Input
    
    // var formData = new FormData();  
    // formData.append('name', fileName); 
    // formData.append('parent_id', '80802264662'); // To Incoming Apps 

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
        success: function(data, status, xhr){ 
            console.log("-----------------");
            console.log("1");
            console.log(data);
            console.log("2");
            console.log(status);
            console.log("3");
            console.log(xhr);
            console.log("4");
            // console.log(xhr[id]);
            console.log("-----------------");

            // fileUpload('1', xhr['id']); 
            // fileUpload('2', xhr['id']); 
        },
        error: function(data){
            console.log("Folder Create Error");
        }
    });

}

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

// Master FIAC Script Start
$(document).ready(function (e) {

    $('#fiac-upload-form').on('submit',(function(e) {

        e.preventDefault(); // Prevent default form submission

        // Create Application Folder, Nested Doc Folder
        folderCreate();

        // fileUpload('1', '80802264662') // Upload File (selector, id)
        // fileUpload('2', '80802264662')
		
        
        
    
    }));

    // Additional Scripts:
  
});
