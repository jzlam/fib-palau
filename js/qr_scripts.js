// Preset filenames for upload
var fileNameMap = new Map([
    [1 , "1. QR Form.pdf"], 
    [2 , "2. Location (§3).pdf"],
    [3, "3. Licenses (§7).pdf"], 
    [4, "4. Employees (§8).pdf"], 
    [5, "5. Employee Programs (§9).pdf"], 
    [6, "6. Tax Information (§10-14).pdf"], 
    [7, "7. Corporate Updates & Loans (§15-17).pdf"], 
    [8, "8. Report Attachment.pdf"] 
]);

// Upload error & progress notifications
function UIfeedBack(name, list) {
    console.log(name + " Create Error");
    document.getElementById("loading-list").style.display = "none";
    document.getElementById(list + "-list").style.display = "block";
}

// Enterprise Folder Creation
function qrFolderCreate() {
    
    var bizName = document.getElementById("biz-name-input").value.trim();
    var currYear = new Date().getFullYear(); 
    var qrtrSelect = document.getElementById("quarter-select"); 
    var quarter = qrtrSelect.options[qrtrSelect.selectedIndex].value;

    var fileName = quarter + " - " + currYear + "; " + bizName; // User Input

    var uploadUrl = 'https://api.box.com/2.0/folders';
    var uploadHeader = {
        'Authorization': 'Bearer 9Tr07m3yE7xwjZQcHgNbvnrA1ZlLHCY7'
    };

    $.ajax({       
        url: uploadUrl,
        headers: uploadHeader,
        type:'POST',
        data: JSON.stringify({ name: fileName, parent: { id: '25738166883' } }),
        // Prevent JQuery from appending as querystring:
        cache: false,
        contentType: 'json',
        processData: false,
        success: function(data){ 
            uploadFiles(data["id"]);
        },
        error: function(data){
            UIfeedBack("QR Folder", "name"); 
        }
    });
}

function uploadFiles(qrFolderID) {

    var apiCalls = [];

    for (var i = 1; i <= 8; i++) { 
        var file = $("#fiac-select" + i.toString(10))[0]; 

        // Skip blank file uploads
        if (file.files.length == 0) {
            continue;
        } else {
            apiCalls.push( fileUpload(file.files[0], qrFolderID, i) ); 
        }
    };

    // Display appropriate prompt 
    //      WHEN async calls done
    $.when.apply($, apiCalls)
    .then(
        function () {
            var errorPresent = $("#fail-list").is(":visible") || $("#name-list").is(":visible")
            if ( !errorPresent ) {
                UIfeedBack("SUCCESS: There is no","success");
            }
    });
}

function fileUpload(file, parentID, i) {

    var fileName = fileNameMap.get(i);
    var formData = new FormData();
    formData.append(fileName, file, fileName); // Selected File
    formData.append('parent_id', parentID); // Parent

    // API 
    var uploadUrl = 'https://upload.box.com/api/2.0/files/content'; 
    var uploadHeader = {
        'Authorization': 'Bearer 9Tr07m3yE7xwjZQcHgNbvnrA1ZlLHCY7'
    };

    return $.ajax({
        url: uploadUrl,
        headers: uploadHeader,
        type:'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        // Feedback: 
        success: function(data) { 
            console.log("Upload Success: " + i);
            document.getElementById("file_" + i.toString(10)).style.display = "block";
        },
        error: function(data){
            UIfeedBack("File " + i, "fail");  
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

    // Other Listeners
    $('#modal-close').on('click', function(){
        document.getElementById("loading-list").style.display = "block";
        document.getElementById("name-list").style.display = "none";
        document.getElementById("loading-modal").style.display = "none";
    });

    // Form Submision
    $('#qr-upload-form').on('submit',(function(e) {
        // Prevent default form submission
        e.preventDefault();
        document.getElementById("loading-modal").style.display = "block"; 
        document.getElementById("name-list").style.display = "none"; 
        document.getElementById("fail-list").style.display = "none"; 
        document.getElementById("success-list").style.display = "none"; 
        document.getElementById("file_1").style.display = "none"; 
        document.getElementById("file_2").style.display = "none"; 
        document.getElementById("file_3").style.display = "none"; 
        document.getElementById("file_4").style.display = "none"; 
        document.getElementById("file_5").style.display = "none"; 
        document.getElementById("file_6").style.display = "none"; 
        document.getElementById("file_7").style.display = "none"; 
        document.getElementById("file_8").style.display = "none"; 

        // Create Enterprise Folder, Nested Doc Folder
        qrFolderCreate();
    }));

});
