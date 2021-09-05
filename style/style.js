$('.ui.sidebar')
  .sidebar('setting', 'transition', 'overlay')
;
$('.ui.sidebar').first()
  .sidebar('attach events', '.right.menu')
;
$('.right.menu')
  .removeClass('disabled')
;



document.getElementById("tag").addEventListener("mouseover", mouseOver);
document.getElementById("tag").addEventListener("mouseout", mouseOut);

function mouseOver() {
  document.getElementById("tag").style.color = "black";
}

function mouseOut() {
  document.getElementById("tag").style.color = "black";
}

