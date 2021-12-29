function NOW(){ 
	const result = new Date();
	const day = result.getDate();
	const month = result.getMonth() + 1;
	const year = result.getFullYear();
	return `${day}-${month}-${year}`;
}
function YEAR(date){
	if(date.split('-').length === 3){
		return date.split('-')[2];
	}else if(date.split('/').length === 3){
		return date.split('/')[2];
	}
}
function MONTH(date){
	if(date.split('-').length === 3){
		return date.split('-')[1];
	}else if(date.split('/').length === 3){
		return date.split('/')[1];
	}
}
function DAY(date){
	if(date.split('-').length === 3){
		return date.split('-')[0];
	}else if(date.split('/').length === 3){
		return date.split('/')[0];
	}
}
function INT(string){ return parseInt(string); }
function STR(int){ return int.toString(); }
