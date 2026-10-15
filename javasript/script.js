// Search Directory Index mapping keywords to specific views/sections
const searchIndex = [
    { title: "Overview Dashboard", category: "Navigation", target: "overview", page: "overview.html", keywords: "home dashboard overview status 98%" },
    { title: "Infrastructure & Branch Connectivity (CT, Durban, Polokwane, Gqeberha)", category: "Infrastructure", target: "infrastructure", page: "infrastructure.html", keywords: "infrastructure router vpn durban polokwane gqeberha cape town network" },
    { title: "Staff Structure & IT Roles", category: "Team", target: "staff", page: "staff.html", keywords: "staff structure apelele mayi zabrhian meiring liya norushu manager" },
    { title: "Security Policy & POPIA Controls", category: "Security", target: "security", page: "security.html", keywords: "security policy popia authentication password mfa encryption" },
    { title: "Service Desk & SLA Tickets", category: "Support", target: "servicedesk", page: "servicedesk.html", keywords: "service desk tickets sla support incident p1 p2 p3" },
    { title: "Disaster Recovery Playbooks & AWS Backup", category: "Recovery", target: "disaster", page: "disaster.html", keywords: "disaster recovery backup aws s3 rto rpo playbook router" },
    { title: "Inventory & Export Products (Canned, Boxed, Bottled, Vacuum)", category: "Catalog", target: "inventory", page: "inventory.html", keywords: "inventory products catalog rooibos chutney ouma rusks biltong canned boxed bottled" },
    { title: "Rooibos Tea & Cape Favourites", category: "Product", target: "inventory", page: "inventory.html", keywords: "rooibos tea export" },
    { title: "Mrs Ball's Chutney", category: "Product", target: "inventory", page: "inventory.html", keywords: "chutney sauce bottled" },
    { title: "Ouma Rusks", category: "Product", target: "inventory", page: "inventory.html", keywords: "ouma rusks bagged" },
    { title: "Sage ERP & Payroll Database", category: "System", target: "infrastructure", page: "infrastructure.html", keywords: "sage erp payroll database server" },
    { title: "Durban VPN Latency (INC-0241)", category: "Ticket", target: "servicedesk", page: "servicedesk.html", keywords: "durban vpn latency inc-0241 liay norushu" }
];

const pageMap = {
    overview: "overview.html",
    infrastructure: "infrastructure.html",
    staff: "staff.html",
    security: "security.html",
    servicedesk: "servicedesk.html",
    disaster: "disaster.html",
    inventory: "inventory.html"
};

const defaultNotifications = [
    {
        id: 1,
        title: "Backup verification passed",
        detail: "Cape Town HQ nightly backup completed successfully with no data warnings.",
        time: "2 min ago",
        unread: true
    },
    {
        id: 2,
        title: "VPN latency alert",
        detail: "Durban branch reported a brief latency spike on the MPLS link.",
        time: "18 min ago",
        unread: true
    },
    {
        id: 3,
        title: "Service desk update",
        detail: "Two support tickets were reassigned to IT operations for follow-up.",
        time: "1 hr ago",
        unread: false
    }
];

document.addEventListener("DOMContentLoaded", () => {
    updateGreeting();
    updateClock();
    setDayNightTheme();
    initSharedHeaderUI();
    renderUserIdentity();
    setupNavigation();
    setupGlobalSearch();
    setupAuthModal();
    renderNotifications();
    setInterval(updateClock, 1000);
    setInterval(setDayNightTheme, 60000);
});

function updateGreeting() {
    const greetingEl = document.getElementById("dynamicGreeting");
    if (!greetingEl) return;

    const hour = new Date().getHours();
    let timeGreeting = "Good morning";

    if (hour >= 12 && hour < 17) {
        timeGreeting = "Good afternoon";
    } else if (hour >= 17) {
        timeGreeting = "Good evening";
    }

    greetingEl.textContent = `${timeGreeting}, Apelele.`;
}

function updateClock() {
    const clockEl = document.getElementById("liveClock");
    const dateEl = document.getElementById("liveDate");
    if (!clockEl && !dateEl) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    });

    if (clockEl) {
        clockEl.textContent = timeString;
        clockEl.setAttribute("title", now.toLocaleString([], {
            weekday: "long",
            month: "short",
            day: "numeric",
            year: "numeric"
        }));
    }

    const formattedDate = now.toLocaleDateString([], {
        weekday: "long",
        day: "numeric",
        month: "long"
    }).toUpperCase();

    if (dateEl) {
        dateEl.textContent = formattedDate;
    }

    document.querySelectorAll(".date-label").forEach((el) => {
        el.textContent = formattedDate;
    });
}

function setDayNightTheme() {
    const hour = new Date().getHours();
    const isNight = hour >= 18 || hour < 6;
    document.body.setAttribute("data-theme", isNight ? "night" : "day");
}

function initSharedHeaderUI() {
    const headerRight = document.querySelector(".header-right");
    if (!headerRight) return;

    const locationButton = document.getElementById("locationBtn");
    if (locationButton && !document.getElementById("locationDropdown")) {
        const locationDropdown = document.createElement("div");
        locationDropdown.id = "locationDropdown";
        locationDropdown.className = "location-dropdown";
        locationDropdown.innerHTML = `
            <button type="button" class="location-option active" data-location="Cape Town HQ">
                <span class="dot green"></span>
                <span>Cape Town HQ</span>
            </button>
            <button type="button" class="location-option" data-location="Durban Branch">
                <span class="dot orange"></span>
                <span>Durban Branch</span>
            </button>
            <button type="button" class="location-option" data-location="Polokwane Branch">
                <span class="dot green"></span>
                <span>Polokwane Branch</span>
            </button>
            <button type="button" class="location-option" data-location="Gqeberha Branch">
                <span class="dot orange"></span>
                <span>Gqeberha Branch</span>
            </button>
        `;
        headerRight.appendChild(locationDropdown);

        locationButton.addEventListener("click", () => {
            locationDropdown.classList.toggle("open");
        });

        locationDropdown.querySelectorAll(".location-option").forEach((option) => {
            option.addEventListener("click", () => {
                const selectedLocation = option.dataset.location;
                const label = document.getElementById("currentLocationLabel");
                if (label) {
                    label.textContent = selectedLocation;
                }

                locationDropdown.querySelectorAll(".location-option").forEach((item) => item.classList.toggle("active", item === option));
                locationDropdown.classList.remove("open");
            });
        });
    }

    const existingClock = document.getElementById("liveClockWrap");
    if (!existingClock) {
        const clockWrap = document.createElement("div");
        clockWrap.className = "clock-display";
        clockWrap.id = "liveClockWrap";
        clockWrap.innerHTML = `
            <span class="clock-label">Local time</span>
            <strong id="liveClock">--:--:--</strong>
            <span id="liveDate" class="clock-date">WEDNESDAY, 15 OCTOBER</span>
        `;

        const notificationButton = headerRight.querySelector(".icon-btn[aria-label='Notifications']");
        if (notificationButton) {
            headerRight.insertBefore(clockWrap, notificationButton);
        } else {
            headerRight.insertBefore(clockWrap, headerRight.firstChild);
        }
    }

    const notificationButton = headerRight.querySelector(".icon-btn[aria-label='Notifications']");
    const notificationPanel = document.getElementById("notificationPanel") || document.createElement("div");

    if (!notificationPanel.id) {
        notificationPanel.id = "notificationPanel";
        notificationPanel.className = "notification-panel";
        notificationPanel.setAttribute("role", "menu");
        headerRight.appendChild(notificationPanel);
    }

    if (notificationButton) {
        notificationButton.setAttribute("aria-expanded", "false");
        const existingBadge = notificationButton.querySelector(".notification-dot");
        if (!existingBadge) {
            const badge = document.createElement("span");
            badge.className = "notification-dot";
            notificationButton.appendChild(badge);
        }

        notificationButton.addEventListener("click", () => {
            const isOpen = notificationPanel.classList.toggle("open");
            notificationButton.setAttribute("aria-expanded", String(isOpen));
        });
        notificationButton.addEventListener("blur", () => {
            setTimeout(() => {
                if (!notificationPanel.contains(document.activeElement)) {
                    notificationPanel.classList.remove("open");
                    notificationButton.setAttribute("aria-expanded", "false");
                }
            }, 120);
        });
    }

    const userPill = headerRight.querySelector(".user-pill");
    if (userPill) {
        userPill.addEventListener("click", () => {
            openAuthModal();
        });
    }

    document.addEventListener("click", (event) => {
        if (!event.target.closest("#notificationPanel") && !event.target.closest(".icon-btn[aria-label='Notifications']")) {
            notificationPanel.classList.remove("open");
            if (notificationButton) {
                notificationButton.setAttribute("aria-expanded", "false");
            }
        }

        if (locationButton && !event.target.closest("#locationDropdown") && !event.target.closest("#locationBtn")) {
            const locationDropdown = document.getElementById("locationDropdown");
            if (locationDropdown) {
                locationDropdown.classList.remove("open");
            }
        }
    });
}

function getStoredUser() {
    try {
        return JSON.parse(localStorage.getItem("vantage-work-user"));
    } catch (error) {
        return null;
    }
}

function setStoredUser(user) {
    if (!user) {
        localStorage.removeItem("vantage-work-user");
        return;
    }

    localStorage.setItem("vantage-work-user", JSON.stringify(user));
}

function renderUserIdentity() {
    const user = getStoredUser();
    const userPill = document.querySelector(".user-pill");
    const profileName = document.querySelector(".user-details strong");
    const profileMeta = document.querySelector(".user-details span");

    if (!user) {
        if (userPill) {
            userPill.textContent = "SI";
            userPill.title = "Sign in with work credentials";
        }

        if (profileName) {
            profileName.textContent = "Guest user";
        }

        if (profileMeta) {
            profileMeta.textContent = "Sign in to continue";
        }

        return;
    }

    const initials = user.name.split(" ").map((part) => part.charAt(0).toUpperCase()).slice(0, 2).join("");

    if (userPill) {
        userPill.textContent = initials || "U";
        userPill.title = `${user.name} · ${user.email}`;
    }

    if (profileName) {
        profileName.textContent = user.name;
    }

    if (profileMeta) {
        profileMeta.textContent = `${user.role} · Sign out`;
    }
}

function setupAuthModal() {
    const modal = document.getElementById("authModal");
    if (modal) return;

    const authModal = document.createElement("div");
    authModal.id = "authModal";
    authModal.className = "auth-modal";
    authModal.innerHTML = `
        <div class="auth-card">
            <button class="close-btn" type="button" aria-label="Close sign-in form" onclick="closeAuthModal()">&times;</button>
            <h2 id="authModalTitle">Sign in with work credentials</h2>
            <p>Use your company email and password to access the dashboard.</p>
            <form id="workSignInForm" novalidate>
                <div class="form-group">
                    <label for="workEmail">Work email</label>
                    <input type="email" id="workEmail" placeholder="name.surname@africanfoods.co.za" required>
                </div>
                <div class="form-group">
                    <label for="workPassword">Password</label>
                    <input type="password" id="workPassword" placeholder="Enter your work password" required>
                </div>
                <div id="authMessage" class="form-message" aria-live="polite"></div>
                <div class="auth-form-actions">
                    <button type="button" id="signOutButton" class="btn-secondary" style="display:none;">Sign out</button>
                    <button type="submit" class="btn-primary">Sign in</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(authModal);

    const form = document.getElementById("workSignInForm");
    const emailField = document.getElementById("workEmail");
    const passwordField = document.getElementById("workPassword");
    const signOutButton = document.getElementById("signOutButton");

    const storedUser = getStoredUser();
    if (storedUser) {
        emailField.value = storedUser.email;
        document.getElementById("authModalTitle").textContent = "Switch account";
        signOutButton.style.display = "inline-flex";
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = emailField.value.trim();
        const password = passwordField.value.trim();
        const authMessage = document.getElementById("authMessage");

        if (!email || !password) {
            authMessage.textContent = "Please enter both your work email and password.";
            authMessage.className = "form-message error";
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            authMessage.textContent = "Enter a valid work email address.";
            authMessage.className = "form-message error";
            return;
        }

        if (password.length < 6) {
            authMessage.textContent = "Your password must be at least 6 characters long.";
            authMessage.className = "form-message error";
            return;
        }

        const nameParts = email.split("@")[0].split(/[._-]+/).filter(Boolean);
        const name = nameParts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
        const role = email.toLowerCase().includes("admin") ? "Systems admin" : "IT support";

        setStoredUser({
            name: name || "Work user",
            email,
            role
        });

        renderUserIdentity();
        closeAuthModal();
        showToast(`Signed in as ${name || "Work user"}.`);
    });

    signOutButton.addEventListener("click", () => {
        setStoredUser(null);
        renderUserIdentity();
        closeAuthModal();
        showToast("Signed out successfully.");
    });
}

function openAuthModal() {
    const modal = document.getElementById("authModal");
    if (!modal) {
        setupAuthModal();
    }

    const currentUser = getStoredUser();
    const title = document.getElementById("authModalTitle");
    const emailField = document.getElementById("workEmail");
    const signOutButton = document.getElementById("signOutButton");

    if (currentUser) {
        emailField.value = currentUser.email;
        title.textContent = "Switch account";
        signOutButton.style.display = "inline-flex";
    } else {
        emailField.value = "";
        title.textContent = "Sign in with work credentials";
        signOutButton.style.display = "none";
    }

    const authMessage = document.getElementById("authMessage");
    if (authMessage) {
        authMessage.textContent = "";
        authMessage.className = "form-message";
    }

    const modalCard = document.getElementById("authModal");
    modalCard.style.display = "flex";
}

function closeAuthModal() {
    const modalCard = document.getElementById("authModal");
    if (modalCard) {
        modalCard.style.display = "none";
    }
}

function getNotifications() {
    try {
        const saved = JSON.parse(localStorage.getItem("vantage-notifications"));
        if (Array.isArray(saved) && saved.length) {
            return saved;
        }
    } catch (error) {
        // fall back to default notifications
    }

    localStorage.setItem("vantage-notifications", JSON.stringify(defaultNotifications));
    return defaultNotifications;
}

function saveNotifications(notifications) {
    localStorage.setItem("vantage-notifications", JSON.stringify(notifications));
}

function renderNotifications() {
    const panel = document.getElementById("notificationPanel");
    if (!panel) return;

    const notifications = getNotifications();
    const unreadCount = notifications.filter((item) => item.unread).length;
    const bellButton = document.querySelector(".icon-btn[aria-label='Notifications']");

    if (bellButton) {
        let dot = bellButton.querySelector(".notification-dot");
        if (!dot) {
            dot = document.createElement("span");
            dot.className = "notification-dot";
            bellButton.appendChild(dot);
        }
        dot.style.display = unreadCount > 0 ? "block" : "none";
    }

    if (!notifications.length) {
        panel.innerHTML = '<div class="notification-empty">No new notifications</div>';
        return;
    }

    panel.innerHTML = notifications.map((notification) => `
        <div class="notification-item ${notification.unread ? "unread" : ""}">
            <div class="notification-item-header">
                <strong>${notification.title}</strong>
                <button type="button" class="notification-close" data-id="${notification.id}" aria-label="Dismiss notification">×</button>
            </div>
            <p>${notification.detail}</p>
            <span>${notification.time}</span>
        </div>
    `).join("");

    panel.querySelectorAll(".notification-close").forEach((button) => {
        button.addEventListener("click", (event) => {
            const nextNotifications = getNotifications().filter((item) => item.id !== Number(event.target.dataset.id));
            saveNotifications(nextNotifications);
            renderNotifications();
        });
    });
}

function goToView(viewId) {
    const page = pageMap[viewId];
    if (page) {
        window.location.href = page;
        return;
    }

    const section = document.getElementById(viewId);
    if (section) {
        switchView(viewId);
    }
}

function setupNavigation() {
    const navItems = document.querySelectorAll(".sidebar-nav .nav-item");
    navItems.forEach((item) => {
        const href = item.getAttribute("href") || "";
        if (href && href !== "#" && !href.startsWith("#")) {
            return;
        }

        item.addEventListener("click", (event) => {
            event.preventDefault();
            const targetId = item.getAttribute("data-target");
            if (targetId) {
                switchView(targetId);
            }
        });
    });
}

function switchView(viewId) {
    const sections = document.querySelectorAll(".view-section");
    sections.forEach((section) => section.classList.remove("active"));

    const targetSection = document.getElementById(viewId);
    if (targetSection) {
        targetSection.classList.add("active");
    }

    const navItems = document.querySelectorAll(".sidebar-nav .nav-item");
    navItems.forEach((item) => {
        if (item.getAttribute("data-target") === viewId) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });

    const mainContent = document.querySelector(".main-content");
    if (mainContent) {
        mainContent.scrollTop = 0;
    }

    const dropdown = document.getElementById("searchResultsDropdown");
    if (dropdown) {
        dropdown.style.display = "none";
    }
}

// Functional Global Search & Autocomplete
function setupGlobalSearch() {
    const searchInput = document.getElementById("globalSearch");
    const dropdown = document.getElementById("searchResultsDropdown");

    if (!searchInput || !dropdown) {
        return;
    }

    searchInput.addEventListener("input", (event) => {
        const query = event.target.value.toLowerCase().trim();

        if (query.length === 0) {
            dropdown.style.display = "none";
            dropdown.innerHTML = "";
            return;
        }

        const matches = searchIndex.filter((item) => {
            return (
                item.title.toLowerCase().includes(query) ||
                item.keywords.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query)
            );
        });

        if (matches.length === 0) {
            dropdown.innerHTML = '<div class="search-item-none">No matching sections, tickets or products found.</div>';
        } else {
            dropdown.innerHTML = matches.map((match) => {
                return `
                    <div class="search-result-item" onclick="selectSearchResult('${match.target}')">
                        <span class="search-cat">${match.category}</span>
                        <strong>${match.title}</strong>
                    </div>
                `;
            }).join("");
        }

        dropdown.style.display = "block";
    });

    document.addEventListener("click", (event) => {
        if (!searchInput.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.style.display = "none";
        }
    });

    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            const query = searchInput.value.toLowerCase().trim();
            const match = searchIndex.find((item) => {
                return item.title.toLowerCase().includes(query) || item.keywords.toLowerCase().includes(query);
            });

            if (match) {
                goToView(match.target);
                searchInput.value = "";
                dropdown.style.display = "none";
            }
        }
    });
}

function selectSearchResult(targetId) {
    goToView(targetId);
    const searchInput = document.getElementById("globalSearch");
    if (searchInput) {
        searchInput.value = "";
    }
}

function openSupportModal() {
    const modal = document.getElementById("supportModal");
    if (modal) {
        modal.style.display = "flex";
    }
}

function closeSupportModal() {
    const modal = document.getElementById("supportModal");
    if (modal) {
        modal.style.display = "none";
    }
}

function submitTicket(event) {
    event.preventDefault();

    const nameField = document.getElementById("ticketName");
    const descriptionField = document.getElementById("ticketDesc");
    const priorityField = document.getElementById("ticketPriority");
    const messageBox = document.getElementById("formMessage");

    const fields = [
        { field: nameField },
        { field: descriptionField },
        { field: priorityField }
    ];

    let hasError = false;

    fields.forEach(({ field }) => {
        if (!field) return;

        const group = field.closest(".form-group");
        const value = field.value ? field.value.trim() : "";

        if (!value) {
            hasError = true;
            if (group) group.classList.add("invalid");
        } else if (group) {
            group.classList.remove("invalid");
        }
    });

    if (hasError) {
        if (messageBox) {
            messageBox.textContent = "Please complete all required fields before submitting the ticket.";
            messageBox.className = "form-message error";
        }
        return;
    }

    if (messageBox) {
        messageBox.textContent = `Ticket ready: ${nameField.value.trim()} · ${priorityField.value} · awaiting submission.`;
        messageBox.className = "form-message success";
    }

    closeSupportModal();
    showToast("Support ticket logged successfully! SLA countdown initiated.");
}

function openOrderModal(category) {
    showToast(`Redirecting to order enquiry for ${category}...`);
    setTimeout(() => {
        goToView("servicedesk");
    }, 1000);
}

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.className = "toast show";

    setTimeout(() => {
        toast.className = toast.className.replace("show", "");
    }, 3000);
}

window.onclick = function (event) {
    const modal = document.getElementById("supportModal");
    if (event.target === modal) {
        closeSupportModal();
    }
};