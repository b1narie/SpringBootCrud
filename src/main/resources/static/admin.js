$(document).ready(function () {
    buildTable();
    buildRolesOptions()
});

function buildTable() {
    $("#tableBody").empty();
    $.ajax({
        type: "GET",
        url: "/rest/users",
        contentType: "application/json",
        success: function (data) {
            console.log(data);
            for (var i in data) {
                $("#tableBody").append(
                    "<tr>" +
                    "<td>" + data[i].id + "</td>" +
                    "<td>" + data[i].name + "</td>" +
                    "<td>" + data[i].login + "</td>" +
                    "<td>" + data[i].password + "</td>" +
                    "<td>" + getUserRoles(data[i].roles) + "</td>" +
                    "<td><button onclick='openEditForm(" + data[i].id + ")' type=\"button\" class=\"btn btn-primary\" data-toggle=\"modal\" data-target=\"#editModal\">Edit</button></td>" +
                    "<td><button onclick='deleteUser(" + data[i].id +")' class=\"btn btn-primary\">Delete</button></td>" +
                    "</tr>"
                );
            }
        },
        error: function (data) {
            console.log(data);
        }
    });
}

function buildRolesOptions() {
    $.ajax({
        type: "GET",
        url: "/rest/roles",
        contentType: "application/json",
        success: function (data) {
            data.forEach(function (role) {
                $("#newUserRole, #userRole").append(
                    "<option role-id=" + role.id + " value=" + role.role + ">" + role.role +"</option>"
                );
            })
        },
        error: function (data) {
            console.log(data);
        }
    });
}

function getUserRoles(roles) {
    var userRoles = [];
    for (var i in roles) {
        userRoles[i] = roles[i].role;
    }
    return userRoles;
}

function addUser() {

    var roles = [];
    $("#newUserRole option:selected").each(function () {
        roles.push({id: $(this).attr("role-id") ,role: $(this).attr("value")})
    });

    var json = {
        name: $("#newUserName").val(),
        login: $("#newUserLogin").val(),
        password: $("#newUserPassword").val(),
        roles: JSON.parse(JSON.stringify(roles))
    };

    $.ajax({
        type: "POST",
        url: "/rest/user",
        data: JSON.stringify(json),
        contentType: "application/json",
        success: function () {
            buildTable();
            location.replace("http://localhost:8080/admin/list");
        },
        error: function (data) {
            console.log(data);
        }
    });
}

function deleteUser(id)  {
    $.ajax({
        type: "DELETE",
        url: "/rest/user/" + id,
        contentType: "application/json",
        success: function (data) {
            location.replace("http://localhost:8080/admin/list");
        },
        error: function (data) {
            console.log(data)
        }
    });
}

function openEditForm(id) {
    $.ajax({
        type: "GET",
        url: "/rest/user/" + id,
        contentType: "application/json",
        success: function (data) {
            var user = JSON.parse(JSON.stringify(data));
            var rolesArr = getUserRoles(user.roles);
            $("#modalHeaderLabel").html("Edit user " + user.name);
            $("#userId").val(user.id);
            $("#userName").val(user.name);
            $("#userLogin").val(user.login);
            // $("#userPassword").val();
            $("#userRole option").each(function () {
                for (var i in rolesArr) {
                    if ($(this).text() === rolesArr[i]) {
                        $(this).prop('selected', true);
                    } else {
                        $(this).prop('selected', false);
                    }
                }
            })
        },
        error: function (data) {
            console.log(data);
        }
    })
}

function updateUser() {
    var roles = [];
    var userId = $("#userId").val();

    $("#userRole option:selected").each(function () {
        roles.push({id: $(this).attr("role-id") ,role: $(this).attr("value")})
    });

    var json = {
        name: $("#userName").val(),
        login: $("#userLogin").val(),
        password: $("#userPassword").val(),
        roles: JSON.parse(JSON.stringify(roles))
    };

    $.ajax({
        type: "PUT",
        url: "/rest/user/" + userId,
        data: JSON.stringify(json),
        contentType: "application/json",
        success: function () {
            buildTable();
            location.replace("http://localhost:8080/admin/list");
        },
        error: function (data) {
            console.log(data);
        }
    });
}