// Preset filenames for upload
var fileNameMap = new Map([
    [1, "1. FIAC.pdf"], 
    [2, "2. Commercial Documents (§6 and 7).pdf"],
    [3, "3. Business Profiles (§8 and 9).pdf"], 
    [4, "4. Affiliated Enterprises (§10, 11, and 12).pdf"], 
    [5, "5. Proof of Financial Responsibility (§13).pdf"], 
    [6, "6. Financial Statement (§13 d) i.).pdf"], 
    [7, "7. Business Proposal (§14).pdf"], 
    [8, "8. Applicant Attachment (§15).pdf"] 
]);

const submissionsFolderID = '325118915175'

function UIfeedBack(name, list) {
    console.log(name + " Create Error");
    document.getElementById("loading-list").style.display = "none";
    document.getElementById(list + "-list").style.display = "block";
}

// Enterprise Folder Creation
function entFolderCreate() {
    var bizName = document.getElementById("biz-name-input").value.trim();

    //console.log(`bizName: "${bizName}"`);

    var currYear = new Date().getFullYear(); 
    var fileName = bizName + "-" + currYear + ";"; // User Input
    console.log(`Trying to create folder with name: "${fileName}"`);

    $.ajax({       
        url: 'http://localhost:3000/create-folder',
        type:'POST',
        data: JSON.stringify({ name: fileName, parentId: submissionsFolderID } ),
        //Creates new folder in "Submitted" folder
        // Prevent JQuery from appending as querystring:
        cache: false,
        contentType: 'application/json',
        processData: false,
        success: function(data){ 
            appFolderCreate(data["id"])
            //uploadFiles( , data["id"]) //Uploads files to application folder
        },
        error: function(data){
            UIfeedBack("Enterprise Folder", "name"); 
        }
    });
}

function appFolderCreate(folderId) {
    var fileName = "Application"

    //console.log("created application folder in" + folderId )

    $.ajax({       
        url: 'http://localhost:3000/create-folder',
        type:'POST',
        data: JSON.stringify({ name: fileName, parentId: folderId } ),
        // Prevent JQuery from appending as querystring:
        cache: false,
        contentType: 'application/json',
        processData: false,
        success: function(data){ 
            uploadFiles(data["id"], folderId);
        },
        error: function(data){
            UIfeedBack("App Folder", "fail"); 
        }
    });
} 

function uploadFiles(appFolderID, entFolderID) {
    var apiCalls = [];

    for (var i = 1; i <= 8; i++) { 
        var file = $("#fiac-select" + i.toString(10))[0]; 

        // Skip blank file uploads
        if (file.files.length == 0) {
            continue;
        } else if (i == 6) {
            apiCalls.push( privFolderHandler(entFolderID, file.files[0]) );
        }
        else {
            apiCalls.push( fileUpload(file.files[0], appFolderID, i) ); 
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

// Implemented embedded Promise, to accomodate Promise.all / .when in uploadFiles()
function privFolderHandler(folderId, file) {
    console.log("Creating Priv Folder");
    //When private folder uploaded, upload private file
    privFolderUpload(folderId, file) //Creates folder named "private"
        .then(data => {
            console.log("Uploading Priv File");
            return fileUpload(file, data["id"], 6);
        })
        .catch(data => {
            console.log("Failed Uploading Priv file");
            UIfeedBack("Private Folder", "fail");
            return fileUpload(file, data["id"], 6);  
        });
}

//Creates folder named private
function privFolderUpload(folderId, file) {
    return new Promise((resolve, reject) => {
    
    var fileName = "Private Documents";

    $.ajax({       
        url: 'http://localhost:3000/create-folder',
        type:'POST',
        data: JSON.stringify({ name: fileName, parentId:folderId } ),
        // Prevent JQuery from appending as querystring:
        cache: false,
        contentType: 'application/json',
        processData: false,
        success: function(data){ 
            resolve(data);
        },
        error: function(data){
            reject(data); 
        }
    });
    })
}

function fileUpload(file, parentID, i) {
    var fileName = fileNameMap.get(i);
    var formData = new FormData();
    formData.append('file', file, fileName); // Selected File
    formData.append('parent_id', parentID); // Parent

    // API 
    return $.ajax({
        url: 'http://localhost:3000/upload-file',
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

   /*  $('#biz-name-input')[0].oninvalid = function () {
        this.setCustomValidity('Enter a name without using the special characters /, \\, and .');
    };
    $('#biz-name-input')[0].oninput= function () {
        this.setCustomValidity(""); 
    }; */

    // Other Listeners
    $('#modal-close').on('click', function(){
        document.getElementById("loading-list").style.display = "block";
        document.getElementById("name-list").style.display = "none";
        document.getElementById("loading-modal").style.display = "none";
    });

    // Form Submision
    $('#fiac-upload-form').on('submit',(function(e) {
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
        entFolderCreate();
    }));

});
