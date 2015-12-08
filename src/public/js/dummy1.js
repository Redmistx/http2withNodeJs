$(document).ready(function(){
    var $avatarPicture = $('#avatarPicture');
    var $input = $('#uploadInput');
    var $idHolder = $('#idHolder');

    // initialize the dropbox
    var avatarDropzone = new Dropzone("#uploadInput",
    {
        maxFilesize: 2,
        maxFiles: 1,
        acceptedFiles: '.jpg, .png, .jpeg, .bmp',
        addRemoveLinks: true,
    });
    avatarDropzone.on('complete', function(file){
        if (!file.accepted) {
        }
        else {
            // if the picture is accepted display it as the new avatar
            var obj = JSON.parse(file.xhr.response);
            $('#avatarPicture').attr('src', obj.displayPath);
        }
    });
    // if more than one file is submited remove it right away
    avatarDropzone.on('maxfilesexceeded', function(file) {
        this.removeFile(file);
    });

    $avatarPicture.click(function(){
        if (confirm('Do you want to delete your avatar?')) {
            // delete the user's avatar
            // make an ajax call to the server that deletes the avatar
            $.ajax({
                url: '/api/deleteAvatar',
                method: 'POST',
                async: true,
                success: function(result) {
                    // update the avatar picture to the default one
                    $avatarPicture.attr('src', 'http://lorempixel.com/400/400/people');
                    // also delete all picture previews from the dropzone
                    avatarDropzone.removeAllFiles();
                }
            });
        }
    });
});