"use strict";

var recepientAvatar = "";

// the user that receives the message
$('#chattest').submit(function(){
    var msgObj = {
       to: recepient,
       msg: $('#m').val(),
       creationDate: new Date()
    }

    if (msgObj.msg === '') {
        return false;
    }

    socket.emit('sending msg', msgObj);
    var $messagesUl = $('#messages');
    var li = $('<li>');
    var sender = $('<span>').text('');
    li.append(sender);
    li.append($('<div>').text(msgObj.msg).addClass('sent'));
    $messagesUl
        .append(li
            .append($('<small>').addClass('right')
                .text(GlobalHelpers.formatDate(msgObj.creationDate))));
    // scroll to the bottom of the chat
    $("#messages").scrollTop($("#messages")[0].scrollHeight);
    $('#m').val('');
    return false;
});

// filter the usernames on every letter typed in the search
$('#to').keyup(function(){
    // _allUsernames
    var searchString = $('#to').val();
    var $users = $('#users');
    $users.empty();
    // get an array with the usernames that start with the given string
    if(searchString === '') {
        //TODO: if the search string is empty show all users with history
        _allUsernames.forEach(function(user){
            // add the usernames that start with the given string to the DOM
            $users.append('<a class="list-group-item" onClick="getHistory(this)" href="#" name="' + user.username + '">' + user.username +'</a>');
            $users.append('<img class="img-responsive" src=' + user.picturePath + ' alt="avatar" />');
        });
    }
    else {
        // if the search string is not empty filter the history users
        _allUsernames.forEach(function(user){
            if (user.username.indexOf(searchString) == 0) {
                // add the usernames that start with the given string to the DOM
                $users.append('<a class="list-group-item" onClick="getHistory(this)" href="#" name="' + user.username + '">' + user.username +'</a>');
                $users.append('<img class="img-responsive" src=' + user.picturePath + ' alt="avatar" />');
            }
        });
    }
});

// make an ajax call to get the history with the selected user
function getHistory(link) {
    var $clickedLink = $(link);
    recepient = $clickedLink.attr('name');
    var length = _allUsernames.length;
    for (var i = 0; i < length; i++) {
        if (_allUsernames[i].username === recepient) {
            recepientAvatar = _allUsernames[i].picturePath;
            break;
        }
    };

    checkUser();

    // if the clicked user is already selected don't make a new ajax call
    if($clickedLink.hasClass('active')) {
        return false;
    }

    // set css for the selected user
    $('.list-group-item').removeClass('active');
    $clickedLink.addClass('active');

    // ajax call that fetches the history with that user
    // on success add it to the DOM
    $.ajax({
        url: '/api/user/getHistory/' + recepient,
        method: 'GET',
        async: true,
        cache: false,
        dataType: 'json',
        beforeSend: function(){
            //some animations or some other shit before sending the request
        },
        success: function(history) {
            var $messagesUl = $('#messages');
            // clear the messages container
            $messagesUl.empty();
            // and fill it up again with the newly fetched history
            history.history.forEach(function(message){
                var li = $('<li>');
                var msgBox = $('<div class="msg-box">');

                if(message.fromUsername != recepient) {
                    msgBox.append($('<div>').text(message.text).addClass('sent'));
                    li.append(msgBox);
                } else {
                    msgBox.append($('<div>').text(message.text).addClass('received'));
                    li.append(msgBox);
                    li.append($('<div class="avatar">').append($('<img class="img-responsive img-circle chat-avatar" src=' + recepientAvatar + ' alt="avatar" />')));
                }

                $messagesUl
                    .append(li
                        .append(msgBox.append($('<small>')
                            .text(GlobalHelpers.formatDate(new Date(message.creationDate))))));
            });
            // scroll to the bottom of the chat
            $("#messages").scrollTop($("#messages")[0].scrollHeight);
        }
    });
}


socket.on('sending msg', function(mesg){
    // check if the msg received comes from the selected user
    // and only then we display it
    if(recepient == mesg.from) {
        var $messagesUl = $('#messages');
        var li = $('<li>');
        li.append('<span>').text(mesg.from)
        li.append($('<div>').text(mesg.msg).addClass('received'));
        $messagesUl
            .append(li
                .append($('<div>')
                        .text(GlobalHelpers.formatDate(new Date(mesg.creationDate)))));
        li.append($('<div class="avatar">').append($('<img class="img-responsive img-circle chat-avatar" src=' + recepientAvatar + ' alt="avatar" />')));
        // when a message arrives and we display it to the user
        // we should scroll to the bottom of the chat
        $("#messages").scrollTop($("#messages")[0].scrollHeight);
    }
});

// checks if user is selected
var checkUser = function () {
    if (recepient) {
        $('#m').removeAttr('disabled', 'disabled').attr('placeholder', 'Write message');
        $('#btn-send').removeAttr('disabled', 'disabled');
    }
};
