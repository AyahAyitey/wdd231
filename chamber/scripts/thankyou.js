/**
 * thankyou.js – Application confirmation page
 * Reads URL query parameters (submitted via form GET) and displays
 * the applicant's information on the thank-you page.
 */

(function displayFormData() {
  const params = new URLSearchParams(window.location.search);

  // Map: { queryParamName → element id in thankyou.html }
  const fieldMap = {
    firstName:       'ty-first-name',
    lastName:        'ty-last-name',
    email:           'ty-email',
    phone:           'ty-phone',
    orgName:         'ty-org-name',
    membershipLevel: 'ty-membership-level',
    timestamp:       'ty-timestamp',
  };

  // Friendly label for membership level values
  const levelLabels = {
    np:     'NP Membership (Non-Profit)',
    bronze: 'Bronze Membership',
    silver: 'Silver Membership',
    gold:   'Gold Membership',
  };

  Object.entries(fieldMap).forEach(([param, elemId]) => {
    const el = document.getElementById(elemId);
    if (!el) return;

    let value = params.get(param) || '';

    // Format membership level to a friendly label
    if (param === 'membershipLevel' && value) {
      value = levelLabels[value] || value;
    }

    // Format timestamp to a readable date/time string
    if (param === 'timestamp' && value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        value = date.toLocaleString('en-GH', {
          year:   'numeric',
          month:  'long',
          day:    'numeric',
          hour:   '2-digit',
          minute: '2-digit',
        });
      }
    }

    el.textContent = value || '\u2014'; // em dash if empty
  });
})();
