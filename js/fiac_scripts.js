


// SUB:

// - Create App Folder
// - Upload F1
//   Succ --> Upload F2 (Pass: fiac-select elementId / parent folder id /  )
//             S --> Upload F3
//             E --> Delete Folder / Rollback F1 & Del Folder
//   Err --> Delete Folder 

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
        // success: function(data){
            // console.log("Upload Success (F" + elementId + "):");
            // console.log(data);
        success: function(xhr, response) { 
            console.log("XHR:");
            console.log(xhr);
            console.log("response:");
            console.log(response);
                     
        },
        error: function(data){
            console.log("Upload Error (F" + elementId + "):");
            console.log(data);
        }
    });
}

// FIAC Script Start
$(document).ready(function (e) {

    $('#fiac-upload-form').on('submit',(function(e) {

        e.preventDefault(); // Prevent default form submission

        // Create Application Folder

        fileUpload('1', '80802264662') // Upload File (selector, id)
        // fileUpload('2', '80802264662')
		
        
        
    
    }));

    // Additional Scripts:
  
});
