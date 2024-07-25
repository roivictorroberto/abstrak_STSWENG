// Global variable to store user data
let currentUserData = null;
$(document).ready(function() {
    // Function to open edit modal with user details
    $(".user-card").click(function() {
        var userId = $(this).data('id');

        // Check if the user is an admin
        $.ajax({
            url: '/checkIfAdmin', // Endpoint to check if user is an admin
            type: 'GET',
            data: { id: userId },
            success: function(response) {
                if (response.isAdmin) {
                   return;
                } else {
                    // Fetch user details if not an admin
                    $.ajax({
                        url: '/getUserDetails', // Endpoint to get user details
                        type: 'GET',
                        data: { id: userId },
                        success: function(user) {
                            $("#headername").text(`Edit ${user.firstName}'s profile`);
                            $("#edit-first-name-input").val(user.firstName);
                            $("#edit-last-name-input").val(user.lastName);
                            $("#edit-role-input").val(user.role);

                            // Store user data globally
                            currentUserData = {
                                id: user._id,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                role: user.role
                            };

                            $(".edit-user-modal").show();
                        },
                        error: function(error) {
                            console.log(error);
                            Swal.fire('Error', 'Failed to fetch user details', 'error');
                        }
                    });
                }
            },
            error: function(error) {
                console.log(error);
                Swal.fire('Error', 'Failed to check user role', 'error');
            }
        });
    });

    // Function to close the modals
    $(".exit, .exit-edit").click(function() {
        $(".add-user-modal, .edit-user-modal").hide();
    });

    // Function to save changes
    $(".submit-edit-user-button").click(function() {
        // Validate fields
        var firstName = $("#edit-first-name-input").val().trim();
        var lastName = $("#edit-last-name-input").val().trim();
        var role = $("#edit-role-input").val();
        
        if (!firstName || !lastName || !role) {
            Swal.fire('Validation Error', 'All fields are required.', 'warning');
            return;
        }

        // Check if there are changes
        if (currentUserData.firstName === firstName &&
            currentUserData.lastName === lastName &&
            currentUserData.role === role) {
            Swal.fire('No Changes', 'No changes were made.', 'info');
            return;
        }

        // Send updated data to server
        $.ajax({
            url: '/updateUserDetails', // Endpoint to update user details
            type: 'POST',
            data: {
                id: currentUserData.id,
                firstName: firstName,
                lastName: lastName,
                role: role
            },
            success: function(response) {
                Swal.fire('Success', 'User details updated successfully', 'success').then(() => {
                    // Hide the edit modal
                    $(".edit-user-modal").hide();
                    // Reload the page
                    location.reload();
                });
                
            },
            error: function(error) {
                console.log(error);
                Swal.fire('Error', 'Failed to update user details', 'error');
            }
        });
    });
});
