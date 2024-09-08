if(parseInt(document.body.clientWidth)<100) {
	document.getElementById('divstatus').style.display='block';
	document.getElementById('divbanner').style.display='none';
} else {
	document.getElementById('divstatus').style.display='none';
	document.getElementById('divbanner').style.display='block';
}