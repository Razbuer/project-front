let countUsersOnPage;
let countUsers;

$(document).ready( function() {
    countUsersOnPage = getCountUsersOnPage();
    countUsers = getCountUsers();

    getUsersAndRender(0, countUsersOnPage);
    renderPaginator(Math.ceil(countUsers / countUsersOnPage));


    // отслеживаем изменение поля выбора кол-ва пользователей на странице
    $(".countUsersOnPage").change(function() {
        countUsersOnPage = getCountUsersOnPage();
        countUsers = getCountUsers();

        getUsersAndRender(0, countUsersOnPage);
        renderPaginator(Math.ceil(countUsers / countUsersOnPage));
    });
});

function getCountUsersOnPage() {
    return $("select.countUsersOnPage option:selected").val();
}

function getCountUsers() {
    let countUsers;
    $.ajax({
        type: "GET",
        url: "/rest/players/count",
        async: false,
        success: function (data) {
            countUsers = data;
        }
    });

    return countUsers;
}

function getCurrentPageNumber() {
    return $(".pagination a.active").html();
}

function getUsersAndRender(pageNumber, pageSize){
    $.ajax({
        method: "GET",
        url: "/rest/players",
        data: {
            pageNumber: pageNumber,
            pageSize: pageSize
        },
        success: function (data) {
            renderRows(data);
        }
    });
};

function renderRows(objects) {
    $("#players tbody").html("");

    for (const object of objects) {
        birthday = new Date(object.birthday);
        userId = object.id;
        $("#players tbody").append("" +
            "<tr class='user" + object.id + "'>" +
                "<td class='userId'>" + object.id + "</td>" +
                "<td class='userName'>" + object.name + "</td>" +
                "<td class='userTitle'>" + object.title + "</td>" +
                "<td class='userRace'>" + object.race + "</td>" +
                "<td class='userProfession'>" + object.profession + "</td>" +
                "<td class='userLevel'>" + object.level + "</td>" +
                "<td class='userBirthday'>" + birthday.getMonth() + "/" + birthday.getDay() + "/" + birthday.getFullYear() + "</td>" +
                "<td class='userBanned'>" + object.banned + "</td>" +
                "<td><img class='editImg' src='/img/edit.png' onclick='editUser(" + userId + ")' /><img class='saveImg' src='/img/save.png' style='display: none;'/></td>" +
                "<td><img class='deleteImg' src='/img/delete.png' onclick='deleteUser(" + userId + ")' /></td>" +
            "</tr>");
    }
};

function renderPaginator(countPage) {
    $(".pagination").html("");

    for (let i = 1; i < countPage + 1; i++) {
        $(".pagination").append("<li><a>" + i + "</a></li>");
    }

    $(".pagination a:first").attr("class", "active");

    $(".pagination a").click(function() {
        const pageNumber = $(this).html();
        $(".pagination a").removeAttr("class");
        $(this).attr("class", "active");
        getUsersAndRender(pageNumber - 1, countUsersOnPage);
    });
};

function deleteUser(userId) {
    $.ajax({
        method: "DELETE",
        url: "/rest/players/" + userId,
        statusCode: {
            200: function () {
                countUsersOnPage = getCountUsersOnPage();
                countUsers = getCountUsers();
                getUsersAndRender(getCurrentPageNumber() - 1, countUsersOnPage);
                renderPaginator(Math.ceil(countUsers / countUsersOnPage));
                console.log("Player with id " + userId + " was deleted!");
            },
            400: function () {
                console.log("Player`s id is invalid");
            },
            404: function () {
                console.log("Player not found");
            }
        }
    })
};

function editUser(userId) {
    $(".user" + userId + " .deleteImg").hide();
    $(".user" + userId + " .editImg").hide();
    $(".user" + userId + " .saveImg").show();

    const userName = $(".user" + userId + " .userName").html();
    $(".user" + userId + " .userName").html("<input type='text' min='1' max='12' value='" + userName + "'/>");

    const userTitle = $(".user" + userId + " .userTitle").html();
    $(".user" + userId + " .userTitle").html("<input type='text' min='1' max='30' value='" + userTitle + "'/>");

    const userRace = $(".user" + userId + " .userRace").html();
    $(".user" + userId + " .userRace").html(
        "<select>" +
            "<option " + (userRace === 'HUMAN' ? "selected='selected'" : '') + ">HUMAN</option>" +
            "<option " + (userRace === 'DWARF' ? "selected='selected'" : '') + ">DWARF</option>" +
            "<option " + (userRace === 'ELF' ? "selected='selected'" : '') + ">ELF</option>" +
            "<option " + (userRace === 'GIANT' ? "selected='selected'" : '') + ">GIANT</option>" +
            "<option " + (userRace === 'ORC' ? "selected='selected'" : '') + ">ORC</option>" +
            "<option " + (userRace === 'TROLL' ? "selected='selected'" : '') + ">TROLL</option>" +
            "<option " + (userRace === 'HOBBIT' ? "selected='selected'" : '') + ">HOBBIT</option>" +
        "</select>");

    const userProfession = $(".user" + userId + " .userProfession").html();
    $(".user" + userId + " .userProfession").html(
        "<select>" +
            "<option " + (userProfession === 'WARRIOR' ? "selected='selected'" : '') + ">WARRIOR</option>" +
            "<option " + (userProfession === 'ROGUE' ? "selected='selected'" : '') + ">ROGUE</option>" +
            "<option " + (userProfession === 'SORCERER' ? "selected='selected'" : '') + ">SORCERER</option>" +
            "<option " + (userProfession === 'CLERIC' ? "selected='selected'" : '') + ">CLERIC</option>" +
            "<option " + (userProfession === 'PALADIN' ? "selected='selected'" : '') + ">PALADIN</option>" +
            "<option " + (userProfession === 'NAZGUL' ? "selected='selected'" : '') + ">NAZGUL</option>" +
            "<option " + (userProfession === 'WARLOCK' ? "selected='selected'" : '') + ">WARLOCK</option>" +
            "<option " + (userProfession === 'DRUID' ? "selected='selected'" : '') + ">DRUID</option>" +
        "</select>");

    const userBanned = $(".user" + userId + " .userBanned").html();
    $(".user" + userId + " .userBanned").html(
        "<select>" +
            "<option " + (userBanned === 'true' ? "selected='selected'" : '') + ">true</option>" +
            "<option " + (userBanned === 'false' ? "selected='selected'" : '') + ">false</option>" +
        "</select>");

    $(".user" + userId + " .saveImg").click(function (){
        $.ajax({
            type: "POST",
            url: "/rest/players/" + userId,
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify({
                name: $(".user" + userId + " .userName input").val(),
                title: $(".user" + userId + " .userTitle input").val(),
                race: $(".user" + userId + " .userRace select").val(),
                profession: $(".user" + userId + " .userProfession select").val(),
                banned: $(".user" + userId + " .userBanned select").val()
            }),
            statusCode: {
                200: function () {
                    getUsersAndRender(getCurrentPageNumber() - 1, countUsersOnPage);
                    console.log("Player with id " + userId + " was updated!");
                },
                400: function () {
                    console.log("Player`s id is invalid");
                },
                404: function () {
                    console.log("Player not found");
                }
            }
        });
    });

};

function createUser() {
    $.ajax({
        type: "POST",
        url: "/rest/players/",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data: JSON.stringify({
            name: $(".createNewAccount .userName input").val(),
            title: $(".createNewAccount .userTitle input").val(),
            race: $(".createNewAccount .userRace select").val(),
            profession: $(".createNewAccount .userProfession select").val(),
            birthday: new Date($(".createNewAccount .userBirthday input").val()).getTime(),
            banned: $(".createNewAccount .userBanned select").val(),
            level: $(".createNewAccount .userLevel input").val()
        }),
        statusCode: {
            200: function () {
                countUsersOnPage = getCountUsersOnPage();
                countUsers = getCountUsers();
                getUsersAndRender(Math.ceil(countUsers / countUsersOnPage) - 1, countUsersOnPage);
                renderPaginator(Math.ceil(countUsers / countUsersOnPage));

                $(".pagination a").removeAttr("class");
                $(".pagination a:last").attr("class", "active");

                console.log("Player is created!");
                $(".resetButton").click();
            },
            400: function () {
                console.log("Player`s data is invalid");
            }
        }
    });
};