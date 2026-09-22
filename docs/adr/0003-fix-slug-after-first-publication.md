# Fix an invitation slug after first publication

An Invitation's slug can change while the Invitation is a draft, but becomes immutable after its first publication. This preserves links already shared with guests and avoids redirect history, stale-link, and migration complexity during the MVP; custom domains and more flexible URL management remain deferred.
