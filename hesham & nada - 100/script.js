// Event Configuration
const eventConfig = {
    title: 'فرح هشام و ندى',
    date: '2026-06-27',
    startTime: '19:00', // Egypt timezone (UTC+3)
    endTime: '22:00',   // Egypt timezone (UTC+3)
    location: 'The Guard Hotel, Sheraton Al Matar, El Nozha, Cairo Governorate 4472111, Egypt',
    locationFull: 'فندق The Guard - شارع الصاعقة - الماظة - القاهرة',
    timezoneId: 'Africa/Cairo'
};

// Convert Egypt time (UTC+3) to UTC
function convertEgyptToUTC(dateStr, timeStr) {
    // timeStr is in Egypt timezone (UTC+3)
    // To convert to UTC, subtract 3 hours
    const [hours, minutes] = timeStr.split(':');
    let utcHours = parseInt(hours) - 3;
    let dateToUse = dateStr;

    // If subtracting 2 hours goes to previous day
    if (utcHours < 0) {
        utcHours += 24;
        const date = new Date(dateStr + 'T00:00:00Z');
        date.setUTCDate(date.getUTCDate() - 1);
        dateToUse = date.toISOString().split('T')[0];
    }

    const paddedHours = String(utcHours).padStart(2, '0');
    const paddedMinutes = String(minutes).padStart(2, '0');
    return dateToUse + 'T' + paddedHours + ':' + paddedMinutes + ':00Z';
}

// Generate Google Calendar URL
function generateGoogleCalendarUrl() {
    const startUtc = convertEgyptToUTC(eventConfig.date, eventConfig.startTime);
    const endUtc = convertEgyptToUTC(eventConfig.date, eventConfig.endTime);

    const startDate = startUtc.replace(/[-:]/g, '').split('.')[0];
    const endDate = endUtc.replace(/[-:]/g, '').split('.')[0];

    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: eventConfig.title,
        dates: `${startDate}/${endDate}`,
        details: eventConfig.locationFull,
        location: eventConfig.location,
        ctz: eventConfig.timezoneId
    });
    return `https://calendar.google.com/calendar/render?${params}`;
}

// Generate Outlook Calendar URL
function generateOutlookCalendarUrl() {
    const startUtc = convertEgyptToUTC(eventConfig.date, eventConfig.startTime);
    const endUtc = convertEgyptToUTC(eventConfig.date, eventConfig.endTime);

    const params = new URLSearchParams({
        subject: eventConfig.title,
        startdt: startUtc.replace('Z', ''),
        enddt: endUtc.replace('Z', ''),
        body: eventConfig.locationFull,
        in_loc: eventConfig.location
    });
    return `https://outlook.live.com/calendar/0/deeplink/compose?${params}`;
}

// Generate Yahoo Calendar URL
function generateYahooCalendarUrl() {
    const startUtc = convertEgyptToUTC(eventConfig.date, eventConfig.startTime);
    const endUtc = convertEgyptToUTC(eventConfig.date, eventConfig.endTime);

    const st = startUtc.replace(/[-:]/g, '').split('.')[0];
    const et = endUtc.replace(/[-:]/g, '').split('.')[0];

    const params = new URLSearchParams({
        v: '60',
        title: eventConfig.title,
        st: st,
        et: et,
        desc: eventConfig.locationFull,
        in_loc: eventConfig.location
    });
    return `https://calendar.yahoo.com/?${params}`;
}

function toggleCalendarDropdown() {
    const dropdown = document.getElementById('calendarDropdown');
    const shareDropdown = document.getElementById('shareDropdown');
    shareDropdown.classList.remove('show');
    dropdown.classList.toggle('show');
}

function toggleShareDropdown() {
    const dropdown = document.getElementById('shareDropdown');
    const calendarDropdown = document.getElementById('calendarDropdown');
    calendarDropdown.classList.remove('show');
    dropdown.classList.toggle('show');
}

function copyInviteLink(e) {
    e.preventDefault();
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        const label = document.getElementById('copyLinkText');
        label.textContent = 'تم النسخ!';
        setTimeout(() => { label.textContent = 'نسخ الرابط'; }, 2000);
    });
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.calendar-dropdown')) {
        document.getElementById('calendarDropdown').classList.remove('show');
    }
    if (!e.target.closest('.share-dropdown')) {
        document.getElementById('shareDropdown').classList.remove('show');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Initialize calendar links with dynamic URLs
    const calendarLinks = document.querySelectorAll('.dropdown-menu .calendar-option');
    if (calendarLinks.length >= 3) {
        calendarLinks[0].href = generateGoogleCalendarUrl();
        calendarLinks[1].href = generateOutlookCalendarUrl();
        calendarLinks[2].href = generateYahooCalendarUrl();
    }

    const whatsappBtn = document.getElementById('whatsappShareBtn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const text = encodeURIComponent('دعوة لحضور  فرح هشام و ندى' + eventConfig.title + ' 💍\n' + window.location.href);
            window.open('https://wa.me/?text=' + text, '_blank');
        });
    }

    const openBtn = document.getElementById('open-btn');
    const openingScreen = document.getElementById('opening-screen');
    const mainContent = document.getElementById('main-content');
    const cardWrapper = document.querySelector('.card-wrapper');

    openBtn.addEventListener('click', () => {
        // 1. Trigger Animation on Cover
        cardWrapper.style.transform = "scale(1.5) ";
        cardWrapper.style.opacity = "0";
        document.querySelector('.instruction-text').style.opacity = "0";

        // 2. Wait and then switch screens
        setTimeout(() => {
            openingScreen.classList.add('hidden');
            openingScreen.style.display = 'none'; // Ensure it's gone

            mainContent.classList.remove('hidden');
            mainContent.style.display = 'flex'; // Restore flex display

            // Allow reflow for animation to trigger if needed, though CSS animation on display block usually handles itself or needs requestAnimationFrame.
            // But here the elements have animation classes with 'forwards' so they will run once they appear.

        }, 600); // Matches the transition time roughly
    });
});
