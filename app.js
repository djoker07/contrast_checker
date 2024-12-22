function updateDemoColors(colorFront, colorBack) {
  const demo = document.querySelector("#sample-text");
  demo.style.color = `rgb(${colorFront.toString()})`;
  demo.style.backgroundColor = `rgb(${colorBack.toString()})`;
}

function updatePerceivedColors(colorFront, colorBack) {
  const demo = document.querySelector("#sample-text-perceived");
  demo.style.color = `rgb(${colorFront.toString()})`;
  demo.style.backgroundColor = `rgb(${colorBack.toString()})`;
}

/* the following functions are adapted from https://stackoverflow.com/a/9733420/3695983 */
// https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-procedure - how to calculate this
function luminanace(r, g, b) {
  var a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// returns the new color based on alpha value
// perceived color is always based on white
// formula --- channel = (a * channel) + (1 - a) * bg_matching_channel
function calculatePerceivedColor(r, g, b, a) {
  // if black, calculate based on white bg for grays
  if (r == 0 && g == 0 && b == 0) {
    r =  Math.round((a * r) + (1 - a) * 255) % 255
    g =  Math.round((a * g) + (1 - a) * 255) % 255
    b =  Math.round((a * b) + (1 - a) * 255) % 255
    return [r, g, b]
  }
  // calculate based on alpha
  r = r == 0 ? 0 : Math.round(r * a)
  g = g == 0 ? 0 : Math.round(g * a)
  b = b == 0 ? 0 : Math.round(b * a)

  return [r, g, b]
}

// color with higher luminance is the dividend
function contrast(rgb1, rgb2) {
  const perceivedFront = calculatePerceivedColor(rgb1[0], rgb1[1], rgb1[2], rgb1[3]);
  const perceivedBack = calculatePerceivedColor(rgb2[0], rgb2[1], rgb2[2], rgb2[3]);
  updatePerceivedHex(perceivedFront, perceivedBack)
  updatePerceivedColors(perceivedFront, perceivedBack)
  console.log("perceived", perceivedFront, perceivedBack)
  const luminanceFront = luminanace(perceivedFront[0], perceivedFront[1], perceivedFront[2]);
  const luminanceBack = luminanace(perceivedBack[0], perceivedBack[1], perceivedBack[2]);
  //console.log("front--" + luminanceFront, "back--" + luminanceBack)
  return luminanceBack > luminanceFront
    ? (luminanceFront + 0.05) / (luminanceBack + 0.05)
    : (luminanceBack + 0.05) / (luminanceFront + 0.05);
}

function updateBoxesColors(colorFront, colorBack) {
  const ratio = contrast(colorFront, colorBack);
  console.log("Ratio", ratio)
  document.querySelector("#aa-normal").className  =  ratio < 0.22222 ? "" : "fail";
  document.querySelector("#aa-large").className   =  ratio < 0.33333 ? "" : "fail";
  document.querySelector("#aaa-normal").className =  ratio < 0.14285 ? "" : "fail";
  document.querySelector("#aaa-large").className  =  ratio < 0.22222 ? "" : "fail";
}

// Update HEX values based on selection
function updateHex(colorFront, colorBack) {
  const colorFrontHex = colorFront.map(function (el, i) {
    if (i == 3) {
      let normalized = Math.round(Number(el) * 255)
      return normalized.toString(16).padStart(2, "0").toUpperCase();
    }
    return Number(el).toString(16).padStart(2, "0").toUpperCase();
  });
  const colorBackHex = colorBack.map(function (el, i) {
    if (i == 3) {
      let normalized = Math.round(Number(el) * 255)
      return normalized.toString(16).padStart(2, "0").toUpperCase();
    }
    return Number(el).toString(16).padStart(2, "0").toUpperCase();
  });
  document.querySelector("#color-1-hex").value = `#${colorFrontHex.join("")}`;
  document.querySelector("#color-2-hex").value = `#${colorBackHex.join("")}`;
}

// Update Perceived HEX
function updatePerceivedHex(colorFront, colorBack) {
  console.log(colorFront, colorBack)
  const colorFrontHex = colorFront.map(function (el, i) {
    return Number(el).toString(16).padStart(2, "0").toUpperCase();
  });
  const colorBackHex = colorBack.map(function (el, i) {
    return Number(el).toString(16).padStart(2, "0").toUpperCase();
  });
  document.querySelector("#color-1-perceived").value = `#${colorFrontHex.join("")}`;
  document.querySelector("#color-2-perceived").value = `#${colorBackHex.join("")}`;
}

function updateColors() {
  const colorFront = [
    document.querySelector("#color-1-r").value,
    document.querySelector("#color-1-g").value,
    document.querySelector("#color-1-b").value,
    document.querySelector("#color-1-a").value
  ];
  const colorBack = [
    document.querySelector("#color-2-r").value,
    document.querySelector("#color-2-g").value,
    document.querySelector("#color-2-b").value,
    document.querySelector("#color-2-a").value
  ];

  updateDemoColors(colorFront, colorBack);
  updateBoxesColors(colorFront, colorBack);
  updateHex(colorFront, colorBack);
}

document
  .querySelectorAll("input[type='number'], input[type='range']")
  .forEach(function (el) {
    el.addEventListener("input", function () {
      if (this.type === "range") {
        this.nextElementSibling.value = this.value;
      } else if (this.type === "number") {
        this.previousElementSibling.value = this.value;
      }
      updateColors();
    });
  });

document.querySelectorAll("input[type='text']").forEach(function (el) {
  el.addEventListener("blur", function () {
    let val = this.value;
    let wrongValue = false;
    if (val[0] === "#") val = val.substring(1);
    if (val.length === 3 || val.length === 6) {
      if (val.length === 3) {
        val = `${val[0]}${val[0]}${val[1]}${val[1]}${val[2]}${val[2]}`;
      }
      if (val.match(/[0-9A-Fa-f]{6}/)) {
        const red = parseInt(`${val[0]}${val[1]}`, 16);
        const green = parseInt(`${val[2]}${val[3]}`, 16);
        const blue = parseInt(`${val[4]}${val[5]}`, 16);
        const target = this.dataset.target;

        document.getElementById(`number-${target}-r`).value = red;
        document.getElementById(`number-${target}-g`).value = green;
        document.getElementById(`number-${target}-b`).value = blue;
        document.getElementById(`color-${target}-r`).value = red;
        document.getElementById(`color-${target}-g`).value = green;
        document.getElementById(`color-${target}-b`).value = blue;

        updateColors();
      } else {
        wrongValue = true;
      }
    } else {
      wrongValue = true;
    }

    if (wrongValue) {
      const colorFront = [
        document.querySelector("#color-1-r").value,
        document.querySelector("#color-1-g").value,
        document.querySelector("#color-1-b").value,
      ];
      const colorBack = [
        document.querySelector("#color-2-r").value,
        document.querySelector("#color-2-g").value,
        document.querySelector("#color-2-b").value,
      ];
      updateHex(colorFront, colorBack);
    }
  });
});

// eyedroper functionality
function hexToRgb(hex) {
  hex = hex.replace(/^#/, ''); // remove leading '#'
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return [r, g, b];
}

document.getElementById("fgEye").addEventListener("click", () => {

  if (!window.EyeDropper) {
    resultElement.textContent =
      "Your browser does not support the EyeDropper API";
    return;
  }

  const eyeDropper = new EyeDropper();
  const abortController = new AbortController();

  eyeDropper
    .open({ signal: abortController.signal })
    .then((result) => {
      const rgb = hexToRgb(result.sRGBHex)
      document.querySelector("#color-1-r").value = rgb[0]
      document.querySelector("#color-1-g").value = rgb[1]
      document.querySelector("#color-1-b").value = rgb[2]
      document.getElementById(`number-1-r`).value = rgb[0];
      document.getElementById(`number-1-g`).value = rgb[1];
      document.getElementById(`number-1-b`).value = rgb[2];
      updateColors()
    })
    .catch((e) => {
      console.error(e)
    });

  setTimeout(() => {
    abortController.abort();
  }, 10000);
});

document.getElementById("bgEye").addEventListener("click", () => {

  if (!window.EyeDropper) {
    resultElement.textContent =
      "Your browser does not support the EyeDropper API";
    return;
  }

  const eyeDropper = new EyeDropper();
  const abortController = new AbortController();

  eyeDropper
    .open({ signal: abortController.signal })
    .then((result) => {
      const rgb = hexToRgb(result.sRGBHex)
      document.querySelector("#color-2-r").value = rgb[0]
      document.querySelector("#color-2-g").value = rgb[1]
      document.querySelector("#color-2-b").value = rgb[2]
      document.getElementById(`number-2-r`).value = rgb[0];
      document.getElementById(`number-2-g`).value = rgb[1];
      document.getElementById(`number-2-b`).value = rgb[2];
      updateColors()
    })
    .catch((e) => {
      console.error(e)
    });

  setTimeout(() => {
    abortController.abort();
  }, 10000);
});
