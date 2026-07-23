#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
git rm -q \
  "components/layouts/app-shell.tsx" \
  "components/layouts/auth-layout.tsx" \
  "components/layouts/container.tsx" \
  "components/layouts/page-header.tsx" \
  "components/layouts/section.tsx" \
  "components/theme-toggle.tsx" \
  "components/ui/accordion.tsx" \
  "components/ui/alert-dialog.tsx" \
  "components/ui/alert.tsx" \
  "components/ui/animate.tsx" \
  "components/ui/aspect-ratio.tsx" \
  "components/ui/avatar.tsx" \
  "components/ui/badge.tsx" \
  "components/ui/breadcrumb.tsx" \
  "components/ui/button.tsx" \
  "components/ui/card.tsx" \
  "components/ui/carousel.tsx" \
  "components/ui/checkbox.tsx" \
  "components/ui/collapsible.tsx" \
  "components/ui/command.tsx" \
  "components/ui/context-menu.tsx" \
  "components/ui/dialog.tsx" \
  "components/ui/drawer.tsx" \
  "components/ui/dropdown-menu.tsx" \
  "components/ui/form.tsx" \
  "components/ui/hover-card.tsx" \
  "components/ui/input-otp.tsx" \
  "components/ui/input.tsx" \
  "components/ui/label.tsx" \
  "components/ui/menubar.tsx" \
  "components/ui/navigation-menu.tsx" \
  "components/ui/pagination.tsx" \
  "components/ui/popover.tsx" \
  "components/ui/progress.tsx" \
  "components/ui/radio-group.tsx" \
  "components/ui/select.tsx" \
  "components/ui/separator.tsx" \
  "components/ui/sheet.tsx" \
  "components/ui/skeleton.tsx" \
  "components/ui/slider.tsx" \
  "components/ui/switch.tsx" \
  "components/ui/table.tsx" \
  "components/ui/tabs.tsx" \
  "components/ui/task-card.tsx" \
  "components/ui/textarea.tsx" \
  "components/ui/toast.tsx" \
  "components/ui/toaster.tsx" \
  "components/ui/toggle-group.tsx" \
  "components/ui/toggle.tsx" \
  "components/ui/tooltip.tsx" \
  "components/ui/use-toast.ts" \
  "hooks/use-toast.ts" \
  "lib/types.ts"
# remove now-empty dirs
rmdir components/layouts hooks 2>/dev/null || true
echo "Deleted 53 dead files. Now run: npm run build"
