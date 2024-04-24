$(document).ready(function(){  
 
    // A delete button which triggers an ajax request for deleting the concerned data. This is done just to show that ajax request can also be used for the functionalities.
$('.delete').on('click',()=>{
          $.ajax({
            type:'DELETE',
            success: function(data){
                location.assign('/')
            }
        });
        return false;
});

    
    // A search input will make the page show only the employees which has the alphabets in its name matching with the search input.
    $('.search').on('keyup',(e)=>{
        const term = e.target.value;
        const t = $('.nam');
        
        Array.from(t).forEach(function(ts){
            const x = ts.innerText;
            if(x.indexOf(term)==-1){
                ts.parentElement.parentElement.parentElement.parentElement.style.display="none";
            }
            else{
                ts.parentElement.parentElement.parentElement.parentElement.style.display="block";
            }
        })
    })
});