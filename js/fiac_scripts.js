
// FIAC Script Start
$(document).ready(function (e) {

	var uploadButton = document.getElementById('fiac-upload-button');
	var fileSelect = document.getElementById('fiac-select');

    $('#fiac-upload-form').on('submit',(function(e) {
		
        e.preventDefault(); // Prevent default form submission
        uploadButton.innerHTML = 'Uploading...'; // UI Feedback 
        var files = fileSelect.files;
        
        var formData = new FormData();
        formData.append('fiac.pdf', files[0], 'fiac.pdf'); // Selected File
        formData.append('parent_id', '80802264662'); // Parent

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
            success: function(data){
                console.log("Upload Success:");
                console.log(data);
            },
            error: function(data, err){
                console.log("Upload Error:");
                console.log(data);
            }
        });
    
    }));

    // Additional Scripts:
  
});





