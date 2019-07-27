// Preset filenames for upload
var fileNameMap = new Map([
    [1 , "1. FIAC.pdf"], 
    [2 , "2. Commercial Documents (§6 and 7).pdf"],
    [3, "3. Business Profiles (§8 and 9).pdf"], 
    [4, "Affiliated Enterprises (§10, 11, and 12).pdf"], 
    [5, "5. Proof of Financial Responsibility (§13).pdf"], 
    [6, "6. Financial Statement (§13 d) i.).pdf"], 
    [7, "7. Business Proposal (§14).pdf"], 
    [8, "8. Applicant Attachment (§15).pdf"] 
]);


// Enterprise Folder Creation
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
            uploadFiles(data["id"], folderId);
        },
        error: function(data){
            console.log("App Folder Create Error");
        }
    });

}

function uploadFiles(appFolderID, entFolderID) {

    var fileCount = $('.custom-file-input').length;

    for (var i = 1; i <= fileCount; i++) { 
        var file = $("#fiac-select" + i.toString(10))[0]; 

        // Skip blank file uploads
        if (file.files.length == 0) {
            continue;
        } else if (i == 6) {
            privFolderCreate(entFolderID, file.files[0]);
        }
        else {
            fileUpload(file.files[0], appFolderID, fileNameMap.get(i));
        }
    };
}

function privFolderCreate(folderId, file) {
    
    var fileName = "Private Documents";
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
            fileUpload(file, data["id"], fileNameMap.get(6));
        },
        error: function(data){
            console.log("Private Folder Create Error");
        }
    });

}

function fileUpload(file, parentId, fileName) {
    // var selectorId =  "fiac-select" + elementId;

    // var fileSelect = document.getElementById(selectorId);
    // var file = fileSelect.files[0];
    
    var formData = new FormData();
    formData.append(fileName, file, fileName); // Selected File
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
            console.log("Upload Succes: " + fileName);
        },
        error: function(data){
            console.log("Upload Error: " + fileName);
        }
    });
}

// Master Script Start
$(document).ready(function (e) {

    // Enable Refresh Prompt
    window.onbeforeunload = function() {
        return true;
    };

    // Validity
    $(".custom-file-input").each( function() {
        $(this)[0].setAttribute("accept", ".pdf,application/pdf");
    });

    $('.custom-file-input').on('change', function(){
        // Add fileName to file label
        var fileDir = $(this).val().split("\\");
        var fileName = fileDir[fileDir.length-1]; 
        $(this).next('.custom-file-label').html(fileName);
    }); 

    $('#biz-name-input')[0].oninvalid = function () {
        this.setCustomValidity('Enter a name without using the special characters /, \\, and .');
    };
    $('#biz-name-input')[0].oninput= function () {
        this.setCustomValidity(""); 
    };

    // Form Submision
    $('#fiac-upload-form').on('submit',(function(e) {
        // Prevent default form submission
        e.preventDefault();
        // Create Enterprise Folder, Nested Doc Folder
        entFolderCreate();
    }));
});
