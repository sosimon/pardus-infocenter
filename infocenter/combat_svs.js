/* NOTE: These files were taken from the combat logging pages and ripped
         completely, with the "var cr = " line removed and the last line
         replaced by the new line... there is no reason to try to do this
         yourself, thankfully. */

function extractId(id)
{
    if (id.indexOf('|') > 0) {
        id = id.substring(0, id.indexOf('|'));
    }
    return id;
}

function simpleNumberFormat(str)
{
    str = String(str);
    var sign = "";
    if (str.charAt(0) == '-') {
        str = str.substr(1);
        sign = "-";
    }
    var formatted = "";
    var digitsStr = "0123456789";
    var digits = 0;
    while (digits < str.length && digitsStr.indexOf(str.charAt(digits)) != -1) { digits++; }
    for (var z = digits - 1; z >= 0; z--) {
        formatted = str.charAt(z) + formatted;
        if ((digits - z) % 3 == 0 && z > 0) {
            formatted = ',' + formatted;
        }
    }
    return sign + formatted + str.substring(digits);
}

var wtype1 = {};
var wtype2 = {};
var windices1 = [];
var windices2 = [];
var p = 0;
var wstats1 = {};
var wstats2 = {};
var damages;
var shots;
var stats1 = {};
var stats2 = {};
var det_stats1 = "";
var det_stats2 = "";

function extractDamage(dmg)
{
    damages = {};
    damages["hull"] = 0;
    damages["armor"] = 0;
    damages["shield"] = 0;
    var z = dmg.indexOf(' ');
    var tmp = dmg.substring(0, z);
    var type = dmg.substr(z+1, 4);
    if (type == "hull")
        damages["hull"] = tmp;
    else if (type == "armo")
        damages["armor"] = tmp;
    else
        damages["shield"] = tmp;
    while (dmg.indexOf(',') > 0) {
        dmg = dmg.substr(dmg.indexOf(',')+2);
        z = dmg.indexOf(' ');
        tmp = dmg.substring(0, z);
        type = dmg.substr(z+1, 4);
        if (type == "hull")
            damages["hull"] = tmp;
        else if (type == "armo")
            damages["armor"] = tmp;
        else
            damages["shield"] = tmp;
    }
    return damages;
}

function extractRate(id)
{
    if (id.indexOf('|') > 0) {
        return id.substr(id.indexOf('|')+1);
    } else {
        return 0;
    }
}

function inArray(search, arr)
{
    for (var z = 0; z < arr.length; z++) {
        if (arr[z] == search)
            return z;
    }
    return -1;
}

function isShip(shipImage) {
	var i = shipImage.lastIndexOf("/") + 1;
	return npc_imgs.indexOf(shipImage.substr(i)) == -1;
}

cr = cr.split(";");
var cr_size = cr.length;
var shipname1 = cr[0];
var shipimage1 = cr[1];
var is_pilot1 = isShip(shipimage1);
var hull1a = cr[2];
var armor1a = cr[3];
var shield1a = cr[4];
var shipname2 = cr[5];
var shipimage2 = cr[6];
var is_pilot2 = isShip(shipimage2);
var hull2a = cr[7];
var armor2a = cr[8];
var shield2a = cr[9];
var weapons1 = "";
var weapons2 = "";
var w1 = {};
var w2 = {};
hits1 = [];
hits2 = [];
raid = [];
lindices1 = [];
lindices2 = [];

l = 0;
var i = 11;
while (cr[i] != 'B') {
    if (cr[i] == 'L' || cr[i] == 'M') {
        id = extractId(cr[i+1]);
        lindices1[l] = id;
        l++;
        weapons1 += (is_pilot1 ? "<img src='" + static_images + "/equipment/" + cr[i+3] + "'> " : "") + cr[i+2] + "<br>";
        w1[id] = is_pilot1 ? "<img src='" + static_images + "/equipment/" + cr[i+3] + "' title='" + cr[i+2] + "'>" : cr[i+2];
        if (inArray(id, windices1) == -1) {
            wtype1[id] = {};
            wtype1[id]["type"] = cr[i];
            wtype1[id]["rate"] = extractRate(cr[i+1]);
            windices1[p] = id;
            p++;
            wtype1[id]["shots"] = 1;
        } else {
            wtype1[id]["shots"]++;
        }
    }
    i++;
}
p = 0;
l = 0;
while (cr[i] != "R1" && cr[i] != 'E') {
    if (cr[i] == 'L' || cr[i] == 'M') {
        id = extractId(cr[i+1]);
        lindices2[l] = id;
        l++;
        weapons2 += (is_pilot2 ? "<img src='" + static_images + "/equipment/" + cr[i+3] + "'> " : "") + cr[i+2] + "<br>";
        w2[id] = is_pilot2 ? "<img src='" + static_images + "/equipment/" + cr[i+3] + "' title='" + cr[i+2] + "'>" : cr[i+2];
        if (inArray(id, windices2) == -1) {
            wtype2[id] = {};
            wtype2[id]["type"] = cr[i];
            wtype2[id]["rate"] = extractRate(cr[i+1]);
            windices2[p] = id;
            p++;
            wtype2[id]["shots"] = 1;
        } else {
            wtype2[id]["shots"]++;
        }
    }
    i++;
}
for (p = 0; p < windices1.length; p++) {
    wstats1[windices1[p]] = {};
    wstats1[windices1[p]]["hits"] = 0;
    wstats1[windices1[p]]["crits"] = 0;
    wstats1[windices1[p]]["jams"] = 0;
    wstats1[windices1[p]]["hull"] = 0;
    wstats1[windices1[p]]["armor"] = 0;
    wstats1[windices1[p]]["shield"] = 0;
}
for (p = 0; p < windices2.length; p++) {
    wstats2[windices2[p]] = {};
    wstats2[windices2[p]]["hits"] = 0;
    wstats2[windices2[p]]["crits"] = 0;
    wstats2[windices2[p]]["jams"] = 0;
    wstats2[windices2[p]]["hull"] = 0;
    wstats2[windices2[p]]["armor"] = 0;
    wstats2[windices2[p]]["shield"] = 0;
}
var round = 2;
while (cr[i] != 'E' && cr[i] != 'L') {
    i = i + 2;
    hits1[round-2] = "";
    while (cr[i] != "S2" && cr[i] != 'E' && cr[i] != 'L') {
        var hitStr = "Hit";
        var dmgStr = cr[i+1];
        if (dmgStr == 'J') {
            wstats1[cr[i]]["jams"]++;
            i = i + 2;
            continue;
        }
        if (dmgStr.charAt(0) == 'C') {
            hitStr = "<b>Critical Hit</b>";
            dmgStr = dmgStr.substr(1);
            wstats1[cr[i]]["crits"]++;
        }
        hits1[round-2] += "<font color='green'>" + hitStr + " with " + w1[cr[i]] + " for: " + dmgStr + "</font><br>";
        wstats1[cr[i]]["hits"]++;
        damages = extractDamage(dmgStr);
        wstats1[cr[i]]["hull"] += parseInt(damages["hull"]);
        wstats1[cr[i]]["armor"] += parseInt(damages["armor"]);
        wstats1[cr[i]]["shield"] += parseInt(damages["shield"]);
        i = i + 2;
    }
    if (cr[i] == 'E' || cr[i] == 'L')
        break;
    i++;
    hits2[round-2] = "";
    while (cr[i] != 'R' + round && cr[i] != 'E' && cr[i] != 'L') {
        var hitStr = "Hit";
        var dmgStr = cr[i+1];
        if (dmgStr == 'J') {
            wstats2[cr[i]]["jams"]++;
            i = i + 2;
            continue;
        }
        if (dmgStr.charAt(0) == 'C') {
            hitStr = "<b>Critical Hit</b>";
            dmgStr = dmgStr.substr(1);
            wstats2[cr[i]]["crits"]++;
        }
        hits2[round-2] += "<font color='green'>" + hitStr + " with " + w2[cr[i]] + " for: " + dmgStr + "</font><br>";
        wstats2[cr[i]]["hits"]++;
        damages = extractDamage(dmgStr);
        wstats2[cr[i]]["hull"] += parseInt(damages["hull"]);
        wstats2[cr[i]]["armor"] += parseInt(damages["armor"]);
        wstats2[cr[i]]["shield"] += parseInt(damages["shield"]);
        i = i + 2;
    }
    round++;
}
if (cr[i] == 'L') {
    who = cr[i+1];
    last_hit_windex = cr[i+2];
    last_hit_wrate = cr[i+3];
    i = i + 4;
} else {
    who = -1;
}
i++;
var hull1b = cr[i];
var ch_hull1 = hull1a - hull1b;
if (ch_hull1 > 0) {
    hull1b += " (change: <font color='red'>-" + ch_hull1 + "</font>)";
} else if (ch_hull1 < 0) {
    ch_hull1 = ch_hull1 * (-1);
    hull1b += " (change: <font color='green'>+" + ch_hull1 + "</font>)";
}
i++;
var armor1b = cr[i];
var ch_armor1 = armor1a - armor1b;
if (ch_armor1 > 0) {
    armor1b += " (change: <font color='red'>-" + ch_armor1 + "</font>)";
} else if (ch_armor1 < 0) {
    ch_armor1 = ch_armor1 * (-1);
    armor1b += " (change: <font color='green' title='Robots'>+" + ch_armor1 + "</font>)";
}
i++;
var shield1b = cr[i];
var ch_shield1 = shield1a - shield1b;
if (ch_shield1 > 0) {
    shield1b += " (change: <font color='red'>-" + ch_shield1 + "</font>)";
} else if (ch_shield1 < 0) {
    ch_shield1 = ch_shield1 * (-1);
    shield1b += " (change: <font color='green' title='Charge'>+" + ch_shield1 + "</font>)";
}
i = i + 2;
var hull2b = cr[i];
var ch_hull2 = hull2a - hull2b;
if (ch_hull2 > 0) {
    hull2b += " (change: <font color='red'>-" + ch_hull2 + "</font>)";
} else if (ch_hull2 < 0) {
    ch_hull2 = ch_hull2 * (-1);
    hull2b += " (change: <font color='green'>+" + ch_hull2 + "</font>)";
}
i++;
var armor2b = cr[i];
var ch_armor2 = armor2a - armor2b;
if (ch_armor2 > 0) {
    armor2b += " (change: <font color='red'>-" + ch_armor2 + "</font>)";
} else if (ch_armor2 < 0) {
    ch_armor2 = ch_armor2 * (-1);
    armor2b += " (change: <font color='green' title='Robots'>+" + ch_armor2 + "</font>)";
}
i++;
var shield2b = cr[i];
var ch_shield2 = shield2a - shield2b;
if (ch_shield2 > 0) {
    shield2b += " (change: <font color='red'>-" + ch_shield2 + "</font>)";
} else if (ch_shield2 < 0) {
    ch_shield2 = ch_shield2 * (-1);
    shield2b += " (change: <font color='green' title='Charge'>+" + ch_shield2 + "</font>)";
}
i++;
if (i < cr_size && cr[i] == 'R') {
    i++;
    var j = 0;
    while (i + 2 < cr_size) {
        raid[j] = {};
        raid[j]["name"] = cr[i];
        raid[j]["image"] = cr[i+1];
        raid[j]["num"] = cr[i+2];
        j++;
        i = i + 3;
    }
}

var complete = "<table width='660' border='0' cellspacing='2' cellpadding='2' class='messagestyle' background='" + static_images + "/bgdark.gif'>";
complete += "<tr><th colspan='4'>Confrontation in " + cmbt_location + "</th></tr>";
complete += "<tr><td colspan='2' align='center' valign='top'><table><tr><td><b>" + shipname1 + "</b><br><img src='" + static_images + "/" + (is_pilot1 ? "ships/" : "opponents/") + shipimage1 + "'><br>Hull: " + hull1a + "<br>Armor: " + armor1a + "<br>Shield: " + shield1a + "</td></tr></table></td>";
complete += "<td colspan='2' align='center' valign='top'><table><tr><td><b>" + shipname2 + "</b><br><img src='" + static_images + "/" + (is_pilot2 ? "ships/" : "opponents/") + shipimage2 + "'><br>Hull: " + hull2a + "<br>Armor: " + armor2a + "<br>Shield: " + shield2a + "</td></tr></table></td></tr>";
complete += "<tr><th colspan='4'>Weapons used</th></tr>";
complete += "<tr><td colspan='2' align='center' valign='top'><table><tr><td>" + weapons1 + "</td></tr></table></td><td colspan='2' align='center' valign='top'><table><tr><td>" + weapons2 + "</td></tr></table></td></tr>";
complete += "<tr><th colspan='4'>Resulting Ship Conditions</th></tr>";
complete += "<tr><td colspan='2' align='center' valign='top'><table><tr><td><b>" + shipname1 + "</b><br><img src='" + static_images + "/" + (is_pilot1 ? "ships/" : "opponents/") + shipimage1 + "'><br>Hull: " + hull1b + "<br>Armor: " + armor1b + "<br>Shield: " + shield1b + "</td></tr></table></td>";
complete += "<td colspan='2' align='center' valign='top'><table><tr><td><b>" + shipname2 + "</b><br><img src='" + static_images + "/" + (is_pilot2 ? "ships/" : "opponents/") + shipimage2 + "'><br>Hull: " + hull2b + "<br>Armor: " + armor2b + "<br>Shield: " + shield2b + "</td></tr></table></td></tr>";
var hits1_size = hits1.length;
var hits2_size = hits2.length;
complete += "<tr><th colspan='4' class='premium'><a href='http://www.pardus.at/index.php?section=premiumfeatures' target='_blank'>Statistics</a></th></tr>";
complete += "<tr><td colspan='2' align='center' valign='top' width='50%'>";

stats1["hits"] = 0;
stats1["hitsm"] = 0;
stats1["crits"] = 0;
stats1["critsm"] = 0;
stats1["jams"] = 0;
stats1["shots"] = 0;
stats1["shotsm"] = 0;
stats1["hull"] = 0;
stats1["hullm"] = 0;
stats1["armor"] = 0;
stats1["armorm"] = 0;
stats1["shield"] = 0;
stats1["shieldm"] = 0;
for (p = 0; p < windices1.length; p++) {
    if (wtype1[windices1[p]]["type"] == 'L') {
        stats1["hits"] += wstats1[windices1[p]]["hits"];
        stats1["crits"] += wstats1[windices1[p]]["crits"];
        if (who == 1) {
            det_shots = (hits1_size - 1) * wtype1[windices1[p]]["rate"] * wtype1[windices1[p]]["shots"];
            for (p2 = 0; p2 <= lindices1.length; p2++) {
                if (p2 > last_hit_windex)
                    break;
                if (windices1[p] == lindices1[p2]) {
                    if (p2 == last_hit_windex) {
                        det_shots += parseInt(last_hit_wrate) + 1;
                    } else {
                        det_shots += parseInt(wtype1[windices1[p]]["rate"]);
                    }
                }
            }
        } else {
            det_shots = hits1_size * wtype1[windices1[p]]["rate"] * wtype1[windices1[p]]["shots"];
        }
        det_shots = parseInt(det_shots);
        det_shots -= wstats1[windices1[p]]["jams"];
        stats1["shots"] += det_shots;
        stats1["jams"] += wstats1[windices1[p]]["jams"];
        stats1["hull"] += wstats1[windices1[p]]["hull"];
        stats1["armor"] += wstats1[windices1[p]]["armor"];
        stats1["shield"] += wstats1[windices1[p]]["shield"];
        if (hits1_size * wtype1[windices1[p]]["rate"] == 0)
            det_ratio = "N/A";
        else
            det_ratio = Math.round(wstats1[windices1[p]]["hits"] / det_shots * 10000) / 100;
    } else {
        stats1["hitsm"] += wstats1[windices1[p]]["hits"];
        stats1["critsm"] += wstats1[windices1[p]]["crits"];
        det_shots = wtype1[windices1[p]]["shots"];
        stats1["shotsm"] += det_shots;
        stats1["hullm"] += wstats1[windices1[p]]["hull"];
        stats1["armorm"] += wstats1[windices1[p]]["armor"];
        stats1["shieldm"] += wstats1[windices1[p]]["shield"];
        det_ratio = Math.round((wstats1[windices1[p]]["hits"] / det_shots) * 10000) / 100;
    }
    var crits = "";
    if (wstats1[windices1[p]]["crits"] > 0) crits = " <font color='green' size='1' title='Critical Hits'>(" + wstats1[windices1[p]]["crits"] + ")</font>";
    var jams = "";
    if (wstats1[windices1[p]]["jams"] > 0) jams = " <font color='yellow' size='1' title='Weapon Malfunctions'>(" + wstats1[windices1[p]]["jams"] + ")</font>";
    det_stats1 += "<tr><td>" + w1[windices1[p]] + "</td><td align='right'>" + wstats1[windices1[p]]["hits"] + crits + "</td><td align='right'>" + det_shots + jams + "</td><td align='right'>" + det_ratio + "%</td><td align='right'>" + wstats1[windices1[p]]["hull"] + "</td><td align='right'>" + wstats1[windices1[p]]["armor"] + "</td><td align='right'>" + wstats1[windices1[p]]["shield"] + "</td><td align='right'></td></tr>";
}
if (stats1["shots"] == 0)
    stats1["ratio"] = "N/A";
else
    stats1["ratio"] = Math.round(stats1["hits"] / stats1["shots"] * 10000) / 100;
if (stats1["shotsm"] == 0)
    stats1["ratiom"] = "N/A";
else
    stats1["ratiom"] = Math.round(stats1["hitsm"] / stats1["shotsm"] * 10000) / 100;
if (stats1["crits"] == 0)
    stats1["crits"] = "";
else
    stats1["crits"] = " <font color='green' size='1' title='Critical Hits'>(" + stats1["crits"] + ")</font>";
if (stats1["critsm"] == 0)
    stats1["critsm"] = "";
else
    stats1["critsm"] = " <font color='green' size='1' title='Critical Hits'>(" + stats1["critsm"] + ")</font>";
if (stats1["jams"] == 0)
    stats1["jams"] = "";
else
    stats1["jams"] = " <font color='yellow' size='1' title='Weapon Malfunctions'>(" + stats1["jams"] + ")</font>";
complete += "<table width='100%' class='premium'><tr><th width='200'>Weapon</th><th>Hits</th><th>Shots</th><th width='100'>Ratio</th><th colspan='3'  width='33%'>Damage</th></tr>";
complete += "<tr><td colspan='4'>&#160;</td><th width='11%'><font size='1'>Hull</font></th><th width='11%'><font size='1'>Armor</font></th><th width='11%'><font size='1'>Shield</font></th></tr>";
complete += "<tr><td nowrap>Total <font size='1'>(Guns)</font></td><td align='right'>" + stats1["hits"] + stats1["crits"] + "</td><td align='right'>" + stats1["shots"] + stats1["jams"] + "</td><td align='right'>" + stats1["ratio"] + "%</td><td align='right'>" + stats1["hull"] + "</td><td align='right'>" + stats1["armor"] + "</td><td align='right'>" + stats1["shield"] + "</td></tr>";
complete += "<tr><td nowrap>Total <font size='1'>(Missiles)</font></td><td align='right'>" + stats1["hitsm"] + stats1["critsm"] + "</td><td align='right'>" + stats1["shotsm"] + "</td><td align='right'>" + stats1["ratiom"] + "%</td><td align='right'>" + stats1["hullm"] + "</td><td align='right'>" + stats1["armorm"] + "</td><td align='right'>" + stats1["shieldm"] + "</td></tr>";
complete += det_stats1 + "</table>";

complete += "</td><td colspan='2' align='center' valign='top' width='50%'>";
stats2["hits"] = 0;
stats2["hitsm"] = 0;
stats2["crits"] = 0;
stats2["critsm"] = 0;
stats2["jams"] = 0;
stats2["shots"] = 0;
stats2["shotsm"] = 0;
stats2["hull"] = 0;
stats2["hullm"] = 0;
stats2["armor"] = 0;
stats2["armorm"] = 0;
stats2["shield"] = 0;
stats2["shieldm"] = 0;
for (p = 0; p < windices2.length; p++) {
    if (wtype2[windices2[p]]["type"] == 'L') {
        stats2["hits"] += wstats2[windices2[p]]["hits"];
        stats2["crits"] += wstats2[windices2[p]]["crits"];
        if (who == 2) {
            det_shots = (hits2_size - 1) * wtype2[windices2[p]]["rate"] * wtype2[windices2[p]]["shots"];
            for (p2 = 0; p2 <= lindices2.length; p2++) {
                if (p2 > last_hit_windex)
                    break;
                if (windices2[p] == lindices2[p2]) {
                    if (p2 == last_hit_windex) {
                        det_shots += parseInt(last_hit_wrate) + 1;
                    } else {
                        det_shots += parseInt(wtype2[windices2[p]]["rate"]);
                    }
                }
            }
        } else {
            det_shots = hits2_size * wtype2[windices2[p]]["rate"] * wtype2[windices2[p]]["shots"];
        }
        det_shots = parseInt(det_shots);
        det_shots -= wstats2[windices2[p]]["jams"];
        stats2["shots"] += det_shots;
        stats2["jams"] += wstats2[windices2[p]]["jams"];
        stats2["hull"] += wstats2[windices2[p]]["hull"];
        stats2["armor"] += wstats2[windices2[p]]["armor"];
        stats2["shield"] += wstats2[windices2[p]]["shield"];
        if (hits2_size * wtype2[windices2[p]]["rate"] == 0)
            det_ratio = "N/A";
        else
            det_ratio = Math.round(wstats2[windices2[p]]["hits"] / (det_shots) * 10000) / 100;
    } else {
        stats2["hitsm"] += wstats2[windices2[p]]["hits"];
        stats2["critsm"] += wstats2[windices2[p]]["crits"];
        det_shots = wtype2[windices2[p]]["shots"];
        stats2["shotsm"] += det_shots;
        stats2["hullm"] += wstats2[windices2[p]]["hull"];
        stats2["armorm"] += wstats2[windices2[p]]["armor"];
        stats2["shieldm"] += wstats2[windices2[p]]["shield"];
        det_ratio = Math.round((wstats2[windices2[p]]["hits"] / det_shots) * 10000) / 100;
    }
    var crits = "";
    if (wstats2[windices2[p]]["crits"] > 0) crits = " <font color='green' size='1' title='Critical Hits'>(" + wstats2[windices2[p]]["crits"] + ")</font>";
    var jams = "";
    if (wstats2[windices2[p]]["jams"] > 0) jams = " <font color='yellow' size='1' title='Weapon Malfunctions'>(" + wstats2[windices2[p]]["jams"] + ")</font>";
    det_stats2 += "<tr><td><font size='1'>" + w2[windices2[p]] + "</font></td><td align='right'>" + wstats2[windices2[p]]["hits"] + crits + "</td><td align='right'>" + det_shots + jams + "</td><td align='right'>" + det_ratio + "%</td><td align='right'>" + wstats2[windices2[p]]["hull"] + "</td><td align='right'>" + wstats2[windices2[p]]["armor"] + "</td><td align='right'>" + wstats2[windices2[p]]["shield"] + "</td></tr>";
}
if (stats2["shots"] == 0)
    stats2["ratio"] = "N/A";
else
    stats2["ratio"] = Math.round(stats2["hits"] / stats2["shots"] * 10000) / 100;
if (stats2["shotsm"] == 0)
    stats2["ratiom"] = "N/A";
else
    stats2["ratiom"] = Math.round(stats2["hitsm"] / stats2["shotsm"] * 10000) / 100;
if (stats2["crits"] == 0)
    stats2["crits"] = "";
else
    stats2["crits"] = " <font color='green' size='1' title='Critical Hits'>(" + stats2["crits"] + ")</font>";
if (stats2["critsm"] == 0)
    stats2["critsm"] = "";
else
    stats2["critsm"] = " <font color='green' size='1' title='Critical Hits'>(" + stats2["critsm"] + ")</font>";
if (stats2["jams"] == 0)
    stats2["jams"] = "";
else
    stats2["jams"] = " <font color='yellow' size='1' title='Weapon Malfunctions'>(" + stats2["jams"] + ")</font>";
complete += "<table width='100%' class='premium'><tr><th width='200'>Weapon</th><th>Hits</th><th>Shots</th><th width='100'>Ratio</th><th colspan='3' width='33%'>Damage</th></tr>";
complete += "<tr><td colspan='4'>&#160;</td><th width='11%'><font size='1'>Hull</font></th><th width='11%'><font size='1'>Armor</font></th><th width='11%'><font size='1'>Shield</font></th></tr>";
complete += "<tr><td nowrap>Total <font size='1'>(Guns)</font></td><td align='right'>" + stats2["hits"] + stats2["crits"] + "</td><td align='right'>" + stats2["shots"] + stats2["jams"] + "</td><td align='right'>" + stats2["ratio"] + "%</td><td align='right'>" + stats2["hull"] + "</td><td align='right'>" + stats2["armor"] + "</td><td align='right'>" + stats2["shield"] + "</td></tr>";
complete += "<tr><td nowrap>Total <font size='1'>(Missiles)</font></td><td align='right'>" + stats2["hitsm"] + stats2["critsm"] + "</td><td align='right'>" + stats2["shotsm"] + "</td><td align='right'>" + stats2["ratiom"] + "%</td><td align='right'>" + stats2["hullm"] + "</td><td align='right'>" + stats2["armorm"] + "</td><td align='right'>" + stats2["shieldm"] + "</td></tr>";
complete += det_stats2 + "</table>";

complete += "</td></tr>";
complete += "<tr><th colspan='4'>Combat Rounds</th></tr>";
var r = 0;
for (var x = 0; x < hits1_size; x++) {
    r++;
    complete += "<tr><th width='5'>" + r + "</th><td valign='top' width='50%'><table><tr><td>" + hits1[x] + "</td></tr></table></td>";
    if (x >= hits2_size) {
        complete += "<td>&#160;</td><td>&#160;</td></tr>";
    } else {
        complete += "<th width='5'>" + r + "</th><td valign='top' width='50%'><table><tr><td>" + hits2[x] + "</td></tr></table></td></tr>";
    }
}
var raided_goods = "";
var raid_size = raid.length;
for (var y = 0; y < raid_size; y++)
    raided_goods += "<img src='//static.pardus.at/img/std/res/" + raid[y]["image"] + "' title='" + raid[y]["name"] + "' alt='" + raid[y]["name"] + "'> : " + simpleNumberFormat(raid[y]["num"]) + "&#160;&#160;";
complete += "</table>";

var reportHtml = raided_goods + complete;
