let countUsersOnPage;

$(document).ready( function() {
    countUsersOnPage = getCountUsersOnPage();
    let countUsers = getCountUsers();

    getUsersAndRender(0, countUsersOnPage);
    renderPaginator(Math.ceil(countUsers / countUsersOnPage));


    // отслеживаем изменение поля выбора кол-ва пользователей на странице
    $(".countUsersOnPage").change(function() {
        countUsersOnPage = getCountUsersOnPage();

        getUsersAndRender(0, countUsersOnPage);
        renderPaginator(Math.ceil(countUsers / countUsersOnPage));
    });
});

// Получение кол-во пользователей сколько нужно отобразить на странице
function getCountUsersOnPage() {
    return $("select.countUsersOnPage option:selected").val();
}

// Получение по API кол-во пользователей в базе всего
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

function getUsersAndRender(pageNumber, pageSize){
    $.ajax({
        type: "GET",
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
        $("#players tbody").append("" +
            "<tr>" +
                "<td>" + object.id + "</td>" +
                "<td>" + object.name + "</td>" +
                "<td>" + object.title + "</td>" +
                "<td>" + object.race + "</td>" +
                "<td>" + object.profession + "</td>" +
                "<td>" + object.level + "</td>" +
                "<td>" + birthday.getMonth() + "/" + birthday.getDay() + "/" + birthday.getFullYear() + "</td>" +
                "<td>" + object.banned + "</td>" +
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
}


