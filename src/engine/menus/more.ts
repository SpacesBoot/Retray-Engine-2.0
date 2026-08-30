let more_form: string = document.getElementById("more_form").innerHTML;

function more(): void {
    Swal.fire({
        title: "More...",
        html: more_form,
        focusConfirm: false,
        showCancelButton: false,
        confirmButtonText: "ok",
        preConfirm: () => {}
        }).then((result) => {
        if (result.isConfirmed) {}
    });
}