
// @license magnet:?xt=urn:btih:e95b018ef3580986a04669f1b5879592219e2a7a&dn=public-domain.txt Public Domain
// Derived from public domain contribution by Joseph Merdrignac, http://archive.is/09Xgd
function getNode(n, v, t) {
	n = document.createElementNS("http://www.w3.org/2000/svg", n);
	for (var p in v)
		if(p == "xlink:href") {
			n.setAttributeNS("http://www.w3.org/1999/xlink", p, v[p]);
		} else if(p == "xmlns:xlink") {
			n.setAttributeNS("http://www.w3.org/2000/xmlns/", p.replace(/[A-Z]/g, function(m, p, o, s) { return "-" + m.toLowerCase(); }), v[p]);
		} else if(p == "xmlns") {
			n.setAttributeNS("http://www.w3.org/2000/xmlns/", p.replace(/[A-Z]/g, function(m, p, o, s) { return "-" + m.toLowerCase(); }), v[p]);
		} else {
			n.setAttributeNS(null, p.replace(/[A-Z]/g, function(m, p, o, s) { return "-" + m.toLowerCase(); }), v[p]);
		}

	if(t)
		n.innerHTML = t;
	return n
}
// @license-end

// @license magnet:?xt=urn:btih:5de60da917303dbfad4f93fb1b985ced5a89eac2&dn=lgpl-2.1.txt LGPL v2.1
// -------------------------------------------------------------------------------------
// Copyright 2017 David Slik, All rights reserved
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

function drawGauge(svg, min, max, cur, unit, label, al, ah, all, ahh) {
	var angle = (cur - min)/(max - min) * 90;
	if(all) { var ll = (all - min)/(max - min) * Math.PI/2; }
	if(al)  { var l = (al - min)/(max - min) * Math.PI/2; }
	if(ah)  { var h = (ah - min)/(max - min) * Math.PI/2; }
	if(ahh) { var hh = (ahh - min)/(max - min) * Math.PI/2; }

	// Background
	svg.appendChild(getNode('rect', { x: 1, y: 1, width: 100, height: 100, stroke:'#FFFFFF', fill:'#000000' }));

	// Scale
	svg.appendChild(getNode('path', { d:"M15,80 A65,65 0 0,1 80,15", fill:'none', stroke:'#FFFFFF' }));

	for (i = 0; i < 11; i++) {
		svg.appendChild(getNode('g', {transform:"rotate(" + (90/10 * i) + " 80 80)" }, "<line x1='15.5' y1='80' x2='10' y2='80' style='stroke:#FFFFFF' />"));
	}

	svg.appendChild(getNode('path', { d:"M20,80 A60,60 0 0,1 80,20", fill:'none', stroke:'#00FF00', 'stroke-width':'5' }));
	
	// Alarms
	if(l) { svg.appendChild(getNode('path', { d:"M20,80 A60,60 0 0,1 " + ((Math.cos(l) * (20 - 80) + Math.sin(l) * (80 - 80)) + 80) + "," + ((Math.sin(l) * (20 - 80) + Math.cos(l) * (80 - 80)) + 80) + "", fill:'none', stroke:'#FFFF00', 'stroke-width':'5' })); }
	if(ll) { svg.appendChild(getNode('path', { d:"M20,80 A60,60 0 0,1 " + ((Math.cos(ll) * (20 - 80) + Math.sin(ll) * (80 - 80)) + 80) + "," + ((Math.sin(ll) * (20 - 80) + Math.cos(ll) * (80 - 80)) + 80) + "", fill:'none', stroke:'#FF0000', 'stroke-width':'5' })); }
	if(h) { svg.appendChild(getNode('path', { d:"M" + ((Math.cos(h) * (20 - 80) + Math.sin(h) * (80 - 80)) + 80) + "," + ((Math.sin(h) * (20 - 80) + Math.cos(h) * (80 - 80)) + 80) + " A60,60 0 0,1 80,20", fill:'none', stroke:'#FFFF00', 'stroke-width':'5' })); }
	if(hh) { svg.appendChild(getNode('path', { d:"M" + ((Math.cos(hh) * (20 - 80) + Math.sin(hh) * (80 - 80)) + 80) + "," + ((Math.sin(hh) * (20 - 80) + Math.cos(hh) * (80 - 80)) + 80) + " A60,60 0 0,1 80,20", fill:'none', stroke:'#FF0000', 'stroke-width':'5' })); }

	// Dial Indicator
	svg.appendChild(getNode('g', {transform:"rotate(" + angle + " 80 80)" }, "<polygon points='80,85 80,75 10,80' style='fill:#AA0000' />"));
	svg.appendChild(getNode('ellipse', { cx: 80, cy: 80, rx: 10, ry: 10, fill:'#0000AA' }));

	// Labels
	svg.appendChild(getNode('text', { x: 4, y: 14, "font-family":"Arial", "text-anchor":"start", "font-size":12, fill:'#FFFFFF' }, unit ));
	svg.appendChild(getNode('text', { x: 80, y: 8, "font-family":"Arial", "text-anchor":"middle", "font-size":7, fill:'#FFFFFF' }, max.toString() ));
	svg.appendChild(getNode('text', { x: 25, y: 88, "font-family":"Arial", "text-anchor":"end", "font-size":7, fill:'#FFFFFF' }, min.toString() ));
	svg.appendChild(getNode('text', { x: 50, y: 98, "font-family":"Arial", "text-anchor":"middle", "font-size":7, fill:'#FFFFFF' }, label + ": " + cur.toString() + " " + unit ));
}
// @license-end


