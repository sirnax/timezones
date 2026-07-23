# Graph Report - .  (2026-07-23)

## Corpus Check
- Corpus is ~20,895 words - fits in a single context window. You may not need a graph.

## Summary
- 479 nodes · 634 edges · 44 communities (39 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.88)
- Token cost: 41,000 input · 9,245 output

## Community Hubs (Navigation)
- [[_COMMUNITY_NPM Dependencies|NPM Dependencies]]
- [[_COMMUNITY_Toast Notification System|Toast Notification System]]
- [[_COMMUNITY_Timezone Map Core Features|Timezone Map Core Features]]
- [[_COMMUNITY_Card  Badge  Auth Layout|Card / Badge / Auth Layout]]
- [[_COMMUNITY_Accordion & Overlay Primitives|Accordion & Overlay Primitives]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Command Palette & Dialog|Command Palette & Dialog]]
- [[_COMMUNITY_shadcn Component Config|shadcn Component Config]]
- [[_COMMUNITY_Layout & Pagination|Layout & Pagination]]
- [[_COMMUNITY_Build & Lint Tooling|Build & Lint Tooling]]
- [[_COMMUNITY_Form Components|Form Components]]
- [[_COMMUNITY_Carousel Component|Carousel Component]]
- [[_COMMUNITY_Root Layout & Theming|Root Layout & Theming]]
- [[_COMMUNITY_Menubar Component|Menubar Component]]
- [[_COMMUNITY_Package Manifest|Package Manifest]]
- [[_COMMUNITY_Animation Primitives|Animation Primitives]]
- [[_COMMUNITY_Context Menu|Context Menu]]
- [[_COMMUNITY_Dropdown Menu|Dropdown Menu]]
- [[_COMMUNITY_Alert Dialog|Alert Dialog]]
- [[_COMMUNITY_Sheet Component|Sheet Component]]
- [[_COMMUNITY_Table Component|Table Component]]
- [[_COMMUNITY_Breadcrumb|Breadcrumb]]
- [[_COMMUNITY_Drawer Component|Drawer Component]]
- [[_COMMUNITY_Navigation Menu|Navigation Menu]]
- [[_COMMUNITY_Select Component|Select Component]]
- [[_COMMUNITY_App Shell & Button|App Shell & Button]]
- [[_COMMUNITY_Toggle Components|Toggle Components]]
- [[_COMMUNITY_OG Share Banner|OG Share Banner]]
- [[_COMMUNITY_Expense Data Types|Expense Data Types]]
- [[_COMMUNITY_Alert Component|Alert Component]]
- [[_COMMUNITY_Input OTP|Input OTP]]
- [[_COMMUNITY_Container Layout|Container Layout]]
- [[_COMMUNITY_Favicon Assets|Favicon Assets]]
- [[_COMMUNITY_Avatar Component|Avatar Component]]
- [[_COMMUNITY_Input Component|Input Component]]
- [[_COMMUNITY_Tabs Component|Tabs Component]]
- [[_COMMUNITY_Textarea Component|Textarea Component]]
- [[_COMMUNITY_Home Page Entry|Home Page Entry]]
- [[_COMMUNITY_Radio Group|Radio Group]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 72 edges
2. `compilerOptions` - 16 edges
3. `Capital` - 7 edges
4. `getUtcOffsetMinutes()` - 7 edges
5. `tailwind` - 6 edges
6. `aliases` - 6 edges
7. `getTimezoneAbbreviation()` - 6 edges
8. `TimeSlider()` - 5 edges
9. `Button` - 5 edges
10. `formatUtcOffset()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `AppShell()` --calls--> `cn()`  [EXTRACTED]
  components/layouts/app-shell.tsx → lib/utils.ts
- `AuthLayout()` --calls--> `cn()`  [EXTRACTED]
  components/layouts/auth-layout.tsx → lib/utils.ts
- `Container()` --calls--> `cn()`  [EXTRACTED]
  components/layouts/container.tsx → lib/utils.ts
- `AlertDialogHeader()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert-dialog.tsx → lib/utils.ts
- `AlertDialogFooter()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert-dialog.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (44 total, 5 thin omitted)

### Community 0 - "NPM Dependencies"
Cohesion: 0.04
Nodes (48): dependencies, class-variance-authority, clsx, cmdk, d3, date-fns, embla-carousel-react, framer-motion (+40 more)

### Community 1 - "Toast Notification System"
Cohesion: 0.07
Nodes (37): Action, ActionType, actionTypes, addToRemoveQueue(), dispatch(), genId(), listeners, memoryState (+29 more)

### Community 2 - "Timezone Map Core Features"
Cohesion: 0.12
Nodes (22): FavouritesPanelProps, SearchBar(), SearchBarProps, TimeSlider(), TimeSliderProps, TimezoneMapApp(), WorldMap, WorldMapProps (+14 more)

### Community 3 - "Card / Badge / Auth Layout"
Cohesion: 0.16
Nodes (14): AuthLayout(), Badge(), BadgeProps, badgeVariants, Card, CardContent, CardDescription, CardFooter (+6 more)

### Community 4 - "Accordion & Overlay Primitives"
Cohesion: 0.10
Nodes (10): AccordionContent, AccordionItem, AccordionTrigger, HoverCardContent, PopoverContent, Progress, Separator, Slider (+2 more)

### Community 5 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 6 - "Command Palette & Dialog"
Cohesion: 0.12
Nodes (15): Command, CommandDialogProps, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator (+7 more)

### Community 7 - "shadcn Component Config"
Cohesion: 0.12
Nodes (16): aliases, components, hooks, lib, ui, utils, rsc, $schema (+8 more)

### Community 8 - "Layout & Pagination"
Cohesion: 0.18
Nodes (13): PageHeader(), Section(), cn(), buttonVariants, Pagination(), PaginationContent, PaginationEllipsis(), PaginationItem (+5 more)

### Community 9 - "Build & Lint Tooling"
Cohesion: 0.13
Nodes (15): devDependencies, eslint, eslint-config-next, eslint-plugin-prettier, eslint-plugin-react-hooks, postcss, tailwind-merge, tailwindcss (+7 more)

### Community 10 - "Form Components"
Cohesion: 0.14
Nodes (11): FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext, FormItemContextValue, FormLabel (+3 more)

### Community 11 - "Carousel Component"
Cohesion: 0.14
Nodes (12): Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem, CarouselNext, CarouselOptions (+4 more)

### Community 12 - "Root Layout & Theming"
Cohesion: 0.19
Nodes (8): dmSans, jakartaSans, jetbrainsMono, metadata, ChunkLoadErrorHandler(), ThemeProvider(), Toaster(), ToasterProps

### Community 13 - "Menubar Component"
Cohesion: 0.17
Nodes (11): Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarLabel, MenubarRadioItem, MenubarSeparator, MenubarShortcut() (+3 more)

### Community 14 - "Package Manifest"
Cohesion: 0.18
Nodes (10): browserslist, engines, node, name, private, scripts, build, dev (+2 more)

### Community 16 - "Context Menu"
Cohesion: 0.20
Nodes (9): ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut(), ContextMenuSubContent (+1 more)

### Community 17 - "Dropdown Menu"
Cohesion: 0.20
Nodes (9): DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut(), DropdownMenuSubContent (+1 more)

### Community 18 - "Alert Dialog"
Cohesion: 0.22
Nodes (8): AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay, AlertDialogTitle

### Community 19 - "Sheet Component"
Cohesion: 0.22
Nodes (8): SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants

### Community 20 - "Table Component"
Cohesion: 0.22
Nodes (8): Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow

### Community 21 - "Breadcrumb"
Cohesion: 0.25
Nodes (7): Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator()

### Community 22 - "Drawer Component"
Cohesion: 0.25
Nodes (6): DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle

### Community 23 - "Navigation Menu"
Cohesion: 0.25
Nodes (7): NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 24 - "Select Component"
Cohesion: 0.25
Nodes (7): SelectContent, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger

### Community 25 - "App Shell & Button"
Cohesion: 0.38
Nodes (3): AppShell(), Button, ButtonProps

### Community 26 - "Toggle Components"
Cohesion: 0.33
Nodes (5): ToggleGroup, ToggleGroupContext, ToggleGroupItem, Toggle, toggleVariants

### Community 27 - "OG Share Banner"
Cohesion: 0.40
Nodes (6): WorldClock OG Image Banner, Clock and Compass Icons, Dark Navy / Teal Visual Theme, Wireframe Globe Motif, Interactive Time Zone Map Tagline, WorldClock Brand Name

### Community 28 - "Expense Data Types"
Cohesion: 0.40
Nodes (4): DateRange, Expense, EXPENSE_CATEGORIES, ExpenseFormData

### Community 29 - "Alert Component"
Cohesion: 0.40
Nodes (4): Alert, AlertDescription, AlertTitle, alertVariants

### Community 30 - "Input OTP"
Cohesion: 0.40
Nodes (4): InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot

### Community 31 - "Container Layout"
Cohesion: 0.50
Nodes (3): Container(), Size, sizes

### Community 32 - "Favicon Assets"
Cohesion: 0.67
Nodes (4): Brand Palette (Dark Navy #1a1a2e + Cyan #00d4ff), Clock Motif (Center Hands), Globe Motif (Meridian & Latitude Lines), Timezones Favicon (Globe + Clock)

### Community 33 - "Avatar Component"
Cohesion: 0.50
Nodes (3): Avatar, AvatarFallback, AvatarImage

### Community 34 - "Input Component"
Cohesion: 0.50
Nodes (3): Input, InputProps, inputVariants

### Community 35 - "Tabs Component"
Cohesion: 0.50
Nodes (3): TabsContent, TabsList, TabsTrigger

### Community 36 - "Textarea Component"
Cohesion: 0.50
Nodes (3): Textarea, TextareaProps, textareaVariants

## Knowledge Gaps
- **287 isolated node(s):** `TimeSliderProps`, `WorldMap`, `dmSans`, `jakartaSans`, `jetbrainsMono` (+282 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Layout & Pagination` to `Toast Notification System`, `Timezone Map Core Features`, `Card / Badge / Auth Layout`, `Accordion & Overlay Primitives`, `Command Palette & Dialog`, `Form Components`, `Carousel Component`, `Menubar Component`, `Context Menu`, `Dropdown Menu`, `Alert Dialog`, `Sheet Component`, `Table Component`, `Breadcrumb`, `Drawer Component`, `Navigation Menu`, `Select Component`, `App Shell & Button`, `Toggle Components`, `Alert Component`, `Input OTP`, `Container Layout`, `Avatar Component`, `Input Component`, `Tabs Component`, `Textarea Component`, `Radio Group`?**
  _High betweenness centrality (0.240) - this node is a cross-community bridge._
- **Why does `dependencies` connect `NPM Dependencies` to `Package Manifest`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Build & Lint Tooling` to `Package Manifest`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `TimeSliderProps`, `WorldMap`, `dmSans` to the rest of the system?**
  _287 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `NPM Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._
- **Should `Toast Notification System` be split into smaller, more focused modules?**
  _Cohesion score 0.07084785133565621 - nodes in this community are weakly interconnected._
- **Should `Timezone Map Core Features` be split into smaller, more focused modules?**
  _Cohesion score 0.12436974789915967 - nodes in this community are weakly interconnected._