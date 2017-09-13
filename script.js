var quadrantEntry = {
	index:"",
	done: false,
	data:""
};
var qCount = [0,0,0,0];

$(document).ready(function(){
	populateQuadrants();
	$('.entrytextarea').keypress(function(e) {
	    if(e.keyCode == 13) {
	    	console.log(e);
	    	var current_id = e.currentTarget;
	        var dataId = "data-"+e.currentTarget.id;
	        var list_data = $('#'+e.currentTarget.id).val();
	        var quadrant = current_id.id;
	        var index = parseInt(quadrant.substr(1));

	        quadrantEntry.done = false;
	        quadrantEntry.data = list_data;
	        quadrantEntry.index = qCount[index]+1;
	        qCount[index]++;
	        var cbId = getCheckBoxId(quadrant,qCount[index]);
	        appendCheckbox($('#'+dataId),list_data,cbId);
	        
	        $('#'+e.currentTarget.id).val('');
	        saveToLocalStorage(current_id.id,quadrantEntry);
	    }
});	


   	$(document).on("change","input[type='checkbox']",function(e) {
        var textid = e.currentTarget.id+"text";
   		var quadrant = e.currentTarget.id.substr(0,2);
   		var curIndex = e.currentTarget.id.substr(3);
        if($(this).is(":checked")) {
        	 $("#"+textid).wrap("<strike>");
        	 toggleCompletionLS(quadrant,curIndex,"true");
        }else{
        	 $("#"+textid).unwrap();
        	 toggleCompletionLS(quadrant,curIndex,"false");
        }
    });

    $('.refresh-btn').click(function(e){
    	localStorage.removeItem("q0");
    	localStorage.removeItem("q1");
    	localStorage.removeItem("q2");
    	localStorage.removeItem("q3");
    	console.log("cleared");
    	location.reload();
    });
});


function saveToLocalStorage(quadrant,data){
	//getlist
	var list = JSON.parse(localStorage.getItem(quadrant));
	if(typeof list ==="undefined" || list === null){
		list = [];
	}
	list.push(data);
	localStorage.setItem(quadrant,JSON.stringify(list));
}

function appendCheckbox(target,data,id){
		target.append("<input type='checkbox' class='filled-in checkboxElement' id='"+id+"'></span><span class='z-depth-4 txt-item' id='"+id+"text'>"+data+"</span><br>");
}

function appendStrikedData(target,data,id){
	target.append("<input type='checkbox' class='checkboxElement' id='"+id+"' checked='true'></span><strike><span class='z-depth-4 txt-item' id='"+id+"text'>"+data+"</span></strike><br>");	
}

function populateQuadrants(){
	for(var i=0;i<4;i++){
		var key = "q"+i;
		var list = localStorage.getItem(key);
		if(typeof list!=="undefined" && list!==null){
			list=JSON.parse(list);
			qCount[i]=parseInt(list[list.length-1].index);
			list.map(function(e){
				if(e.done!=="true"){
					addPendingEntry(key,e);
				}else{
					addCompletedEntry(key,e);
				}
			});
		}
	}
}
function addCompletedEntry(quadrant,entry){
	var target = $("#data-"+quadrant);
	var elemid=getCheckBoxId(quadrant,entry.index);
	appendStrikedData(target,entry.data,elemid);
}
function addPendingEntry(quadrant,entry){
	var target = $("#data-"+quadrant);
	var elemid=getCheckBoxId(quadrant,entry.index);
	appendCheckbox(target,entry.data,elemid);
}
function getCheckBoxId(quadrant,index){
	return quadrant+"-"+index;
}
function toggleCompletionLS(quadrant,id,status){
	var list = localStorage.getItem(quadrant);
	if(typeof list!=="undefined" && list!==null){
			list=JSON.parse(list);
			list.map(function(e){
				if(e.index==id){
					e.done = status;
				}
			});
		}
	localStorage.setItem(quadrant,JSON.stringify(list));
}

