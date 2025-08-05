export default class Constants {
    // Legacy constants (keeping for backward compatibility)
    static readonly PRODUCT = "Product";
    static readonly SEARCH_BUTTON = "Search Button";
    static readonly MESSAGE = "Message";
    static readonly MY_ACCOUNT = "My Account";
    static readonly LOGOUT = "Logout";
    static readonly REGISTER = "Register";
    static readonly FIRST_NAME = "First Name";
    static readonly LAST_NAME = "Last Name";
    static readonly EMAIL = "Email";
    static readonly TELEPHONE = "Telephone";
    static readonly PASSWORD = "Password";
    static readonly CONFIRM_PASSWORD = "Confirm Password";
    static readonly PRIVACY_POLICY = "Privacy Policy";
    static readonly CONTINUE = "Continue";

    // ===== HWPC PAGE ROUTES =====
    static readonly TICKETS_PAGE = "/tickets";
    static readonly HOME_PAGE = "/";
    static readonly LOGIN_PAGE = "/login";
    static readonly REGISTER_PAGE = "/register";
    static readonly PROFILE_PAGE = "/profile";

    // ===== HWPC SEARCH FUNCTIONALITY =====
    static readonly SEARCH_INPUT = "Search Input";
    static readonly SEARCH_FORM = "Search Form";
    static readonly SEARCH_RESULTS = "Search Results";
    static readonly NO_RESULTS_MESSAGE = "No Results Message";
    static readonly LOADING_INDICATOR = "Loading Indicator";
    static readonly SEARCH_RESULTS_COUNT = "Search Results Count";

    // ===== HWPC TICKET ELEMENTS =====
    static readonly TICKET = "Ticket";
    static readonly TICKET_LIST = "Ticket List";
    static readonly TICKET_ITEM = "Ticket Item";
    static readonly TICKET_TITLE = "Ticket Title";
    static readonly TICKET_ID = "Ticket ID";
    static readonly TICKET_STATUS = "Ticket Status";
    static readonly TICKET_PRIORITY = "Ticket Priority";
    static readonly TICKET_DESCRIPTION = "Ticket Description";
    static readonly TICKET_CREATED_DATE = "Ticket Created Date";
    static readonly TICKET_UPDATED_DATE = "Ticket Updated Date";
    static readonly TICKET_ASSIGNEE = "Ticket Assignee";

    // ===== HWPC NAVIGATION ELEMENTS =====
    static readonly NAVIGATION_MENU = "Navigation Menu";
    static readonly MOBILE_MENU_TOGGLE = "Mobile Menu Toggle";
    static readonly HOME_LINK = "Home Link";
    static readonly TICKETS_LINK = "Tickets Link";
    static readonly PROFILE_LINK = "Profile Link";
    static readonly LOGIN_LINK = "Login Link";
    static readonly REGISTER_LINK = "Register Link";
    static readonly LOGOUT_LINK = "Logout Link";

    // ===== HWPC MOBILE NAVIGATION =====
    static readonly MOBILE_NAV_MENU = "Mobile Navigation Menu";
    static readonly MOBILE_NAV_TOGGLE = "Mobile Navigation Toggle";
    static readonly HAMBURGER_MENU = "Hamburger Menu";
    static readonly MOBILE_DROPDOWN = "Mobile Dropdown";

    // ===== HWPC FORM ELEMENTS =====
    static readonly SUBMIT_BUTTON = "Submit Button";
    static readonly CANCEL_BUTTON = "Cancel Button";
    static readonly SAVE_BUTTON = "Save Button";
    static readonly DELETE_BUTTON = "Delete Button";
    static readonly EDIT_BUTTON = "Edit Button";
    static readonly CREATE_BUTTON = "Create Button";

    // ===== HWPC RESULT DISPLAY ELEMENTS =====
    static readonly RESULTS_CONTAINER = "Results Container";
    static readonly MOBILE_RESULT_CARD = "Mobile Result Card";
    static readonly DESKTOP_RESULT_TABLE = "Desktop Result Table";
    static readonly PAGINATION_CONTAINER = "Pagination Container";
    static readonly NEXT_PAGE_BUTTON = "Next Page Button";
    static readonly PREVIOUS_PAGE_BUTTON = "Previous Page Button";

    // ===== HWPC MESSAGE ELEMENTS =====
    static readonly SUCCESS_MESSAGE = "Success Message";
    static readonly ERROR_MESSAGE = "Error Message";
    static readonly WARNING_MESSAGE = "Warning Message";
    static readonly INFO_MESSAGE = "Info Message";
    static readonly VALIDATION_ERROR = "Validation Error";

    // ===== HWPC USER INTERFACE ELEMENTS =====
    static readonly PAGE_TITLE = "Page Title";
    static readonly PAGE_HEADER = "Page Header";
    static readonly BREADCRUMB = "Breadcrumb";
    static readonly FOOTER = "Footer";
    static readonly SIDEBAR = "Sidebar";
    static readonly MAIN_CONTENT = "Main Content";

    // ===== MOBILE VIEWPORT CONFIGURATIONS =====
    static readonly MOBILE_VIEWPORT = { width: 375, height: 667 };
    static readonly MOBILE_LARGE_VIEWPORT = { width: 414, height: 896 };
    static readonly TABLET_VIEWPORT = { width: 768, height: 1024 };
    static readonly TABLET_LANDSCAPE_VIEWPORT = { width: 1024, height: 768 };
    static readonly DESKTOP_VIEWPORT = { width: 1920, height: 1080 };
    static readonly DESKTOP_SMALL_VIEWPORT = { width: 1366, height: 768 };

    // ===== RESPONSIVE BREAKPOINTS =====
    static readonly RESPONSIVE_BREAKPOINT_MOBILE = 768;
    static readonly RESPONSIVE_BREAKPOINT_TABLET = 1024;
    static readonly RESPONSIVE_BREAKPOINT_DESKTOP = 1200;
    static readonly RESPONSIVE_BREAKPOINT_LARGE_DESKTOP = 1920;

    // ===== MOBILE-SPECIFIC INTERACTION CONSTANTS =====
    static readonly TOUCH_TIMEOUT = 3000;
    static readonly MOBILE_WAIT_TIMEOUT = 5000;
    static readonly MOBILE_SCROLL_TIMEOUT = 2000;
    static readonly MOBILE_ANIMATION_TIMEOUT = 1000;
    static readonly MOBILE_NETWORK_TIMEOUT = 10000;

    // ===== MOBILE GESTURE CONSTANTS =====
    static readonly SWIPE_DISTANCE = 100;
    static readonly SWIPE_DURATION = 300;
    static readonly TAP_DURATION = 100;
    static readonly LONG_PRESS_DURATION = 1000;
    static readonly PINCH_SCALE_FACTOR = 0.5;

    // ===== MOBILE INTERACTION DELAYS =====
    static readonly MOBILE_CLICK_DELAY = 100;
    static readonly MOBILE_TYPE_DELAY = 50;
    static readonly MOBILE_SCROLL_DELAY = 200;
    static readonly MOBILE_TRANSITION_DELAY = 500;

    // ===== ENVIRONMENT-SPECIFIC CONSTANTS =====
    static readonly DEFAULT_BASE_URL = "http://10.147.17.219:3004";
    static readonly TEST_ENVIRONMENT = "test";
    static readonly QA_ENVIRONMENT = "qa";
    static readonly PROD_ENVIRONMENT = "prod";

    // ===== HWPC API ENDPOINTS (for future API testing) =====
    static readonly API_BASE_PATH = "/api/v1";
    static readonly TICKETS_API_ENDPOINT = "/tickets";
    static readonly USERS_API_ENDPOINT = "/users";
    static readonly AUTH_API_ENDPOINT = "/auth";
    static readonly SEARCH_API_ENDPOINT = "/search";

    // ===== TEST DATA CONSTANTS =====
    static readonly TEST_TICKET_PREFIX = "TEST_TICKET_";
    static readonly TEST_USER_PREFIX = "TEST_USER_";
    static readonly INVALID_SEARCH_TERM = "INVALID_SEARCH_TERM_12345";
    static readonly VALID_SEARCH_TERM = "ticket";

    // ===== ACCESSIBILITY CONSTANTS =====
    static readonly ARIA_LABEL = "aria-label";
    static readonly ARIA_EXPANDED = "aria-expanded";
    static readonly ARIA_HIDDEN = "aria-hidden";
    static readonly ROLE_BUTTON = "button";
    static readonly ROLE_NAVIGATION = "navigation";
    static readonly ROLE_MAIN = "main";

    // ===== ADDITIONAL MOBILE VIEWPORT CONFIGURATIONS =====
    static readonly IPHONE_SE_VIEWPORT = { width: 375, height: 667 };
    static readonly IPHONE_12_VIEWPORT = { width: 390, height: 844 };
    static readonly IPHONE_12_PRO_MAX_VIEWPORT = { width: 428, height: 926 };
    static readonly SAMSUNG_GALAXY_S21_VIEWPORT = { width: 360, height: 800 };
    static readonly PIXEL_5_VIEWPORT = { width: 393, height: 851 };
    static readonly IPAD_VIEWPORT = { width: 768, height: 1024 };
    static readonly IPAD_PRO_VIEWPORT = { width: 1024, height: 1366 };

    // ===== RESPONSIVE DESIGN UTILITY CONSTANTS =====
    static readonly CSS_MOBILE_MEDIA_QUERY = "(max-width: 767px)";
    static readonly CSS_TABLET_MEDIA_QUERY = "(min-width: 768px) and (max-width: 1023px)";
    static readonly CSS_DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";

    // ===== MOBILE-SPECIFIC CSS CLASSES =====
    static readonly MOBILE_HIDDEN_CLASS = "d-none d-md-block";
    static readonly MOBILE_VISIBLE_CLASS = "d-block d-md-none";
    static readonly RESPONSIVE_CONTAINER_CLASS = "container-fluid";
    static readonly MOBILE_NAVIGATION_CLASS = "navbar-collapse";

    // ===== TOUCH INTERACTION CONSTANTS =====
    static readonly TOUCH_START_EVENT = "touchstart";
    static readonly TOUCH_END_EVENT = "touchend";
    static readonly TOUCH_MOVE_EVENT = "touchmove";
    static readonly MOUSE_DOWN_EVENT = "mousedown";
    static readonly MOUSE_UP_EVENT = "mouseup";

    // ===== MOBILE PERFORMANCE CONSTANTS =====
    static readonly MOBILE_SLOW_NETWORK_TIMEOUT = 15000;
    static readonly MOBILE_FAST_NETWORK_TIMEOUT = 5000;
    static readonly MOBILE_IMAGE_LOAD_TIMEOUT = 8000;
    static readonly MOBILE_SCRIPT_LOAD_TIMEOUT = 10000;

    // ===== RESPONSIVE GRID CONSTANTS =====
    static readonly MOBILE_COLUMNS = 1;
    static readonly TABLET_COLUMNS = 2;
    static readonly DESKTOP_COLUMNS = 3;
    static readonly LARGE_DESKTOP_COLUMNS = 4;

    // ===== MOBILE NAVIGATION PATTERNS =====
    static readonly HAMBURGER_MENU_SELECTOR = ".navbar-toggler, .hamburger, .mobile-menu-btn";
    static readonly MOBILE_MENU_OVERLAY = ".mobile-menu-overlay, .navbar-backdrop";
    static readonly MOBILE_MENU_SLIDE_DURATION = 300;
    static readonly MOBILE_MENU_FADE_DURATION = 200;

    // ===== MOBILE FORM INTERACTION CONSTANTS =====
    static readonly MOBILE_INPUT_FOCUS_DELAY = 300;
    static readonly MOBILE_KEYBOARD_SHOW_DELAY = 500;
    static readonly MOBILE_KEYBOARD_HIDE_DELAY = 300;
    static readonly MOBILE_FORM_VALIDATION_DELAY = 200;

    // ===== MOBILE SCROLL BEHAVIOR CONSTANTS =====
    static readonly MOBILE_SCROLL_BEHAVIOR = "smooth";
    static readonly MOBILE_SCROLL_BLOCK = "center";
    static readonly MOBILE_SCROLL_INLINE = "nearest";
    static readonly MOBILE_INFINITE_SCROLL_THRESHOLD = 100;

    // ===== DEVICE ORIENTATION CONSTANTS =====
    static readonly PORTRAIT_ORIENTATION = "portrait-primary";
    static readonly LANDSCAPE_ORIENTATION = "landscape-primary";
    static readonly ORIENTATION_CHANGE_DELAY = 500;

    // ===== MOBILE-SPECIFIC SELECTORS =====
    static readonly MOBILE_SEARCH_SELECTOR = ".mobile-search, .search-mobile, [data-mobile-search]";
    static readonly MOBILE_FILTER_SELECTOR = ".mobile-filter, .filter-mobile, [data-mobile-filter]";
    static readonly MOBILE_SORT_SELECTOR = ".mobile-sort, .sort-mobile, [data-mobile-sort]";
    static readonly MOBILE_PAGINATION_SELECTOR = ".mobile-pagination, .pagination-mobile";

    // ===== RESPONSIVE IMAGE CONSTANTS =====
    static readonly MOBILE_IMAGE_QUALITY = 0.8;
    static readonly TABLET_IMAGE_QUALITY = 0.9;
    static readonly DESKTOP_IMAGE_QUALITY = 1.0;
    static readonly LAZY_LOAD_THRESHOLD = "200px";

    // ===== MOBILE ACCESSIBILITY CONSTANTS =====
    static readonly MOBILE_MIN_TOUCH_TARGET = 44; // pixels
    static readonly MOBILE_RECOMMENDED_TOUCH_TARGET = 48; // pixels
    static readonly MOBILE_FOCUS_OUTLINE_WIDTH = 2; // pixels
    static readonly MOBILE_TEXT_CONTRAST_RATIO = 4.5;
}