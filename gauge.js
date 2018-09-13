// -------------------------------------------------------------------------------------
// Copyright 2017, 2018 David Slik, All rights reserved
//
// Released under the LGPL 2.1 license
//
// INPUTS
// 		svg - SVG node
// 		min - Minimum value for gauge
// 		max - Maximum value for gauge
// 		cur - Current value for gauge
// 		unit - Unit string (e.g. "V")
//		label - Description of measure (e.g. "Bus A")
//		al - Alarm Low - Value to indicate a low alarm. Can be omitted by specifying null
//		ah - Alarm High - Value to indicate a high alarm. Can be omitted by specifying null
//		all - Alarm Low Low - Value to indicate a low low alarm. Can be omitted by specifying null
//		ahh - Alarm High High - Value to indicate a high high alarm. Can be omitted by specifying null
//
// Gauges can be scaled and translated using SVG groups. For example, to translate a graph, use:
// 
// 		group = getNode('g', {transform:"translate(102 0)" });
//		rawGauge(group, 0, 60, 52.3, "V", "Battery 1", 50, null, 48, null);
//		svg.appendChild(group);
//
// To scale a graph, use:
// 
// 		group = getNode('g', {transform:"scale(2)" });
//		rawGauge(group, 0, 60, 52.3, "V", "Battery 1", 50, null, 48, null);
//		svg.appendChild(group);
//
// ----------------------------------------------------------------------------------------

// Convenience function that creates an SVG element from type, value and text strings
function svgen(n, v, t) {
	n = document.createElementNS("http://www.w3.org/2000/svg", n);
	for (var p in v)
		if(p == "xlink:href") { n.setAttributeNS("http://www.w3.org/1999/xlink", p, v[p]); }
		else if(p == "xmlns:xlink") { n.setAttributeNS("http://www.w3.org/2000/xmlns/", p, v[p]); }
		else if(p == "xmlns") { n.setAttributeNS("http://www.w3.org/2000/xmlns/", p, v[p]); }
		else if(p == "xml:space") { n.setAttributeNS("http://www.w3.org/XML/1998/namespace", p, v[p]); }
		else { n.setAttributeNS(null, p, v[p]); }
	if(t) n.innerHTML = t;
	return n
}

function drawGauge(svg, min, max, cur, unit, label, al, ah, all, ahh) {
	var angle = (cur - min)/(max - min) * 90;
	if(all) { var ll = (all - min)/(max - min) * Math.PI/2; }
	if(al)  { var l = (al - min)/(max - min) * Math.PI/2; }
	if(ah)  { var h = (ah - min)/(max - min) * Math.PI/2; }
	if(ahh) { var hh = (ahh - min)/(max - min) * Math.PI/2; }

	// Background
	svg.appendChild(svgen('rect', { x: 1, y: 1, width: 100, height: 100, stroke:'#FFFFFF', fill:'#000000' }));

	// Scale
	svg.appendChild(svgen('path', { d:"M15,80 A65,65 0 0,1 80,15", fill:'none', stroke:'#FFFFFF' }));

	for (i = 0; i < 11; i++) {
		svg.appendChild(svgen('g', {transform:"rotate(" + (90/10 * i) + " 80 80)" }, "<line x1='15.5' y1='80' x2='10' y2='80' style='stroke:#FFFFFF' />"));
	}

	svg.appendChild(svgen('path', { d:"M20,80 A60,60 0 0,1 80,20", fill:'none', stroke:'#00FF00', 'stroke-width':'5' }));
	
	// Alarms
	if(l) { svg.appendChild(svgen('path', { d:"M20,80 A60,60 0 0,1 " + ((Math.cos(l) * (20 - 80) + Math.sin(l) * (80 - 80)) + 80) + "," + ((Math.sin(l) * (20 - 80) + Math.cos(l) * (80 - 80)) + 80) + "", fill:'none', stroke:'#FFFF00', 'stroke-width':'5' })); }
	if(ll) { svg.appendChild(svgen('path', { d:"M20,80 A60,60 0 0,1 " + ((Math.cos(ll) * (20 - 80) + Math.sin(ll) * (80 - 80)) + 80) + "," + ((Math.sin(ll) * (20 - 80) + Math.cos(ll) * (80 - 80)) + 80) + "", fill:'none', stroke:'#FF0000', 'stroke-width':'5' })); }
	if(h) { svg.appendChild(svgen('path', { d:"M" + ((Math.cos(h) * (20 - 80) + Math.sin(h) * (80 - 80)) + 80) + "," + ((Math.sin(h) * (20 - 80) + Math.cos(h) * (80 - 80)) + 80) + " A60,60 0 0,1 80,20", fill:'none', stroke:'#FFFF00', 'stroke-width':'5' })); }
	if(hh) { svg.appendChild(svgen('path', { d:"M" + ((Math.cos(hh) * (20 - 80) + Math.sin(hh) * (80 - 80)) + 80) + "," + ((Math.sin(hh) * (20 - 80) + Math.cos(hh) * (80 - 80)) + 80) + " A60,60 0 0,1 80,20", fill:'none', stroke:'#FF0000', 'stroke-width':'5' })); }

	// Dial Indicator
	svg.appendChild(svgen('g', {transform:"rotate(" + angle + " 80 80)" }, "<polygon points='80,85 80,75 10,80' style='fill:#AA0000' />"));
	svg.appendChild(svgen('ellipse', { cx: 80, cy: 80, rx: 10, ry: 10, fill:'#0000AA' }));

	// Labels
	svg.appendChild(svgen('text', { x: 4, y: 14, "font-family":"Arial", "text-anchor":"start", "font-size":12, fill:'#FFFFFF' }, unit ));
	svg.appendChild(svgen('text', { x: 80, y: 8, "font-family":"Arial", "text-anchor":"middle", "font-size":7, fill:'#FFFFFF' }, max.toString() ));
	svg.appendChild(svgen('text', { x: 25, y: 88, "font-family":"Arial", "text-anchor":"end", "font-size":7, fill:'#FFFFFF' }, min.toString() ));
	svg.appendChild(svgen('text', { x: 50, y: 98, "font-family":"Arial", "text-anchor":"middle", "font-size":7, fill:'#FFFFFF' }, label + ": " + cur.toString() + " " + unit ));
}



