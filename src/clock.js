const developerMode = false;
const debug = document.getElementById('debug');
const log = msg => {
  if (developerMode) {
    debug.innerHTML += JSON.stringify(msg) + '<br>';
  }
  console.log(msg);
};

log('developer mode enabled');

var theme;
var twelveHr;
var showSeconds;
var commaBeforeYear;
var separator;
var monthFormat;
var weekdayFormat;
var textColor;
var faceText;
var accentColor;
var scale;

try {
  theme = typeof Usertheme == 'undefined' ? 'dark' : Usertheme;
  twelveHr = typeof UsertwelveHr === 'undefined' ? false : UsertwelveHr;
  showSeconds = typeof UsershowSeconds === 'undefined' ? false : UsershowSeconds;
  commaBeforeYear = typeof UsercommaBeforeYear === 'undefined' ? false : UsercommaBeforeYear;
  separator = typeof Userseparator === 'undefined' ? ':' : Userseparator;
  monthFormat = typeof UsermonthFormat === 'undefined' ? 'short' : UsermonthFormat;
  weekdayFormat = typeof UserweekdayFormat === 'undefined' ? 'long' : UserweekdayFormat;
  textColor = typeof UsertextColor === 'undefined' ? '#ebba60' : UsertextColor;
  accentColor = typeof UseraccentColor === 'undefined' ? 'red' : UseraccentColor;
  faceText = typeof UserfaceText === 'undefined' ? '' : UserfaceText;
  scale = typeof Userscale === 'undefined' ? '1.0' : Userscale;
} catch (error) {
  developerMode = true;
  log('Uh oh. Something went wrong with your settings. Try resetting all your options to fix it.');
  developerMode = false;
}

(options => {
  // UI Elements
  const UI = {
    debug: document.getElementById('debug'),
    container: document.querySelector('.container'),
    time: document.getElementById('time'),
    hour: document.getElementById('hour'),
    minute: document.getElementById('minute'),
    seconds: document.getElementById('seconds'),
    meridiem: document.getElementById('meridiem'),
    date: document.getElementById('date'),
    weekday: document.getElementById('weekday'),
    month: document.getElementById('month'),
    day: document.getElementById('day'),
    year: document.getElementById('year'),
    separators: [...document.querySelectorAll('.separator')],
    superscript: document.getElementById('superscript'),
    analog: {
      container: document.getElementById('analog-container'),
      face: document.getElementById('face'),
      hour: document.getElementById('analog-hour'),
      minute: document.getElementById('analog-minute'),
      second: document.getElementById('analog-second'),
      cap: document.querySelector('.hand-cap'),
      date: document.getElementById('date-window'),
      weekday: document.getElementById('analog-weekday'),
      text: document.getElementById('face-text'),
      ticks: [...document.querySelectorAll('.tick')],
      numbers: document.querySelector('.numbers'),
      hands: [...document.querySelectorAll('.hand')],
    },
  };

  const shortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

  const longMonthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const shortWeekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];

  const longWeekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getMonth = i => {
    return options.monthFormat == 'long' ? longMonthNames[i] : shortMonthNames[i];
  };

  const getWeekday = (i, fmt = false) => {
    if (fmt) {
      return fmt == 'long' ? longWeekdayNames[i] : shortWeekdayNames[i];
    }
    return options.weekdayFormat == 'long' ? longWeekdayNames[i] : shortWeekdayNames[i];
  };

  const getSuper = day => {
    switch (day) {
      case '1':
      case '21':
      case '31':
        return 'st';
      case '2':
      case '22':
        return 'nd';
      case '3':
      case '23':
        return 'rd';
      default:
        return 'th';
    }
  };

  const getHour = hr => {
    if (options.twelveHr) {
      // Actual 12 hour time.
      hr = hr >= 12 ? hr % 12 : hr;
      hr = hr == 0 ? 12 : hr;
    } else {
      // add leading zeroes to hour if less than 10
      hr = hr < 10 ? (hr = '0' + hr) : hr;
    }
    return hr;
  };

  const getMeridiem = hr => {
    if (options.twelveHr && hr >= 12) {
      return 'PM';
    }
    return 'AM';
  };

  const getMinute = min => {
    return min < 10 ? '0' + min : min;
  };

  const getSeconds = sec => {
    return sec < 10 ? '0' + sec : sec;
  };

  const getMinSecRotation = num => {
    return `${(360 / 60) * num}deg`;
  };

  const getHourRotation = (hr, min) => {
    return `${(360 / 12) * (hr % 12) + (min / 60) * 30}deg`;
  };

  const setTickRotation = () => {
    const ticks = [...document.querySelectorAll('.tick')];
    ticks.forEach((tick, i) => {
      tick.style.transform = `rotate(${i * 6}deg)`;
    });
  };

  const applyOptions = options => {
    if (options.scale) {
      UI.analog.container.style.transform = `scale(${options.scale})`;
    }

    if (!options.twelveHr) {
      UI.meridiem.style.display = 'none';
    }

    if (!options.showSeconds) {
      UI.separators[1].style.display = 'none';
      UI.seconds.style.display = 'none';
    }

    UI.separators.forEach(el => {
      el.innerHTML = options.separator;
    });

    if (options.theme !== 'dark') {
      UI.container.style.color = 'black';
      UI.hour.style.color = 'black';
      UI.date.style.color = 'black';
      UI.meridiem.style.color = 'black';
      UI.separators[0].style.color = 'black';
      UI.separators[1].style.color = 'black';
      UI.month.style.color = 'black';
      UI.day.style.color = 'black';
      UI.superscript.style.color = 'black';
      UI.year.style.color = 'black';

      //analog
      UI.analog.face.style.background = 'white';
      UI.analog.numbers.style.color = '#333333';
      UI.analog.hands.forEach(hand => {
        hand.style.background = '#333333';
      });
      UI.analog.date.style.background = 'white';
      UI.analog.date.style.color = '#333333';
      UI.analog.weekday.style.color = '#333333';
    }

    if (options.textColor) {
      UI.weekday.style.color = options.textColor;
    }

    if (options.faceText) {
      UI.analog.text.innerHTML = options.faceText;
    }

    if (options.accentColor) {
      UI.analog.second.style.background = options.accentColor;
      UI.analog.cap.style.background = options.accentColor;
    }
  };

  function tick() {
    // Time Elements
    const today = new Date();
    const month = today.getMonth();
    const date = today.getDate();
    const weekday = today.getDay();
    const hour = today.getHours();
    const min = today.getMinutes();
    const seconds = today.getSeconds();
    const year = today.getFullYear();

    // Time
    UI.meridiem.innerHTML = `${getMeridiem(hour)}`;
    UI.hour.innerHTML = `${getHour(hour)}`;
    UI.minute.innerHTML = `${getMinute(min)}`;
    UI.seconds.innerHTML = `${getSeconds(seconds)}`;

    // Date
    UI.weekday.innerHTML = `${getWeekday(weekday)}`;
    UI.month.innerHTML = `${getMonth(month)}`;
    UI.day.innerHTML = `${date}`;
    UI.superscript.innerHTML = `${getSuper(date)}`;
    UI.year.innerHTML = `${options.commaBeforeYear ? ', ' : ''} ${year}`;

    // analog clock
    UI.analog.hour.style.transform = `rotate(${getHourRotation(hour, min)})`;
    UI.analog.minute.style.transform = `rotate(${getMinSecRotation(min)})`;
    UI.analog.second.style.transform = `rotate(${getMinSecRotation(seconds)})`;
    UI.analog.date.innerHTML = `${date}`;
    UI.analog.weekday.innerHTML = `${getWeekday(weekday, 'short')}`;
  }

  setTickRotation();
  applyOptions(options);
  tick();
  setInterval(tick, 500);
})({
  theme,
  twelveHr,
  showSeconds,
  commaBeforeYear,
  separator,
  monthFormat,
  weekdayFormat,
  textColor,
  faceText,
  accentColor,
  scale
});
