# PDF Processing & Weekly Pagination Implementation Plan

## Overview

This document outlines the steps to add PDF file upload functionality to the watermark-graphic-maker project, process the PDF data to match the existing `WeeklySchedule` schema, and display it with weekly pagination.

**Current State:**
- Project accepts text input and uses OpenAI API to parse it into structured schedule data
- Schema supports 7-day weekly schedules with events, times, and activities
- No file upload or PDF processing currently implemented
- `pdfreader` library already installed but not utilized

**Goal State:**
- Accept PDF file uploads containing schedule data
- Extract and parse PDF content into `WeeklySchedule` format
- Support multi-week PDFs with week-by-week pagination
- Maintain existing text input functionality as alternative method

---

## Week 1: PDF Upload & Basic File Handling

### Tasks

**1.1 Add File Upload UI Component**
- [ ] Add file input element to control panel in `src/routes/+page.svelte`
- [ ] Create file input with accept attribute: `.pdf` only
- [ ] Add file size validation (max 10MB recommended)
- [ ] Style file input to match existing control panel design
- [ ] Add loading state indicator for file processing

**1.2 Update Form Schema for File Handling**
- [ ] Update `formSchema` in `src/routes/schema.ts` to support optional file field
- [ ] Create new Zod schema variant: `fileFormSchema` for PDF uploads
- [ ] Decide on approach: separate form action vs. combined form

**1.3 Configure Multipart Form Handling**
- [ ] Update `+page.server.ts` to handle `multipart/form-data`
- [ ] Add form action for file uploads (e.g., `?/uploadPDF`)
- [ ] Implement file receiving logic using SvelteKit's request handling
- [ ] Add error handling for invalid file types or missing files

**1.4 Basic PDF Text Extraction**
- [ ] Import and configure `pdfreader` in `+page.server.ts`
- [ ] Create helper function: `extractTextFromPDF(buffer: Buffer): Promise<string>`
- [ ] Parse PDF and extract raw text content
- [ ] Test with sample PDF files to verify text extraction
- [ ] Add logging for debugging extracted text

**Deliverable:** File upload form that accepts PDFs and extracts raw text content

---

## Week 2: PDF Processing & Data Parsing

### Tasks

**2.1 Text Processing & Cleanup**
- [ ] Create text preprocessing function to clean extracted PDF text
- [ ] Handle common PDF extraction issues (line breaks, spacing, formatting)
- [ ] Normalize date formats (e.g., "11/3" → "November 3")
- [ ] Normalize time formats (e.g., "830am" → "8:30 a.m.")
- [ ] Test with various PDF formats and layouts

**2.2 Integrate with OpenAI Parser**
- [ ] Pass extracted PDF text to existing OpenAI parsing logic
- [ ] Reuse `WeeklyScheduleSchema` for validation
- [ ] Update OpenAI prompt to handle PDF-extracted text format
- [ ] Add error handling for parsing failures
- [ ] Implement fallback: show raw text if parsing fails

**2.3 Handle Single-Week PDFs**
- [ ] Validate parsed data matches `WeeklySchedule` structure
- [ ] Display parsed schedule on main canvas
- [ ] Test end-to-end: PDF upload → extraction → parsing → display
- [ ] Add success/error messages for user feedback

**2.4 Data Storage Setup**
- [ ] Create state management for multiple weeks of data
- [ ] Add TypeScript interface: `MultiWeekSchedule` extending `WeeklySchedule`
- [ ] Store parsed schedule data in component state
- [ ] Prepare data structure for pagination (array of weeks)

**Deliverable:** Working PDF upload → parse → display flow for single-week PDFs

---

## Week 3: Multi-Week Support & Week Detection

### Tasks

**3.1 Multi-Week Data Schema**
- [ ] Create new type in `src/app.d.ts`: `MultiWeekSchedule`
  ```typescript
  interface MultiWeekSchedule {
    weeks: WeeklySchedule[];  // Array of weekly schedules
    weekStartDates: string[]; // e.g., ["Nov 3", "Nov 10", "Nov 17"]
  }
  ```
- [ ] Update Zod schema to support array of weekly schedules
- [ ] Create `MultiWeekScheduleSchema` for validation

**3.2 Week Boundary Detection**
- [ ] Implement logic to detect week boundaries in extracted text
- [ ] Look for date patterns that indicate start of new week
- [ ] Handle cases where weeks are explicitly labeled ("Week 1", "Week of Nov 3")
- [ ] Split extracted text into week segments

**3.3 Parse Multiple Weeks**
- [ ] Loop through week segments and parse each individually
- [ ] Pass each segment to OpenAI parser or parse all at once
- [ ] Aggregate results into `MultiWeekSchedule` structure
- [ ] Add validation: ensure each week has 7 days
- [ ] Handle partial weeks (fill with empty days if needed)

**3.4 Update Server Response**
- [ ] Modify `+page.server.ts` to return multi-week data structure
- [ ] Add metadata: total weeks, current week index
- [ ] Update form message response type to support `MultiWeekSchedule`

**Deliverable:** Backend can process multi-week PDFs and return structured data

---

## Week 4: Pagination UI & Navigation

### Tasks

**4.1 Pagination State Management**
- [ ] Add `currentWeekIndex` state variable in `+page.svelte`
- [ ] Initialize to 0 (first week)
- [ ] Create derived state: `displaySchedule` based on current week index
- [ ] Update reactive statement to handle multi-week data

**4.2 Week Navigation Controls**
- [ ] Add "Previous Week" and "Next Week" buttons to control panel
- [ ] Style buttons to match existing UI
- [ ] Implement button click handlers to update `currentWeekIndex`
- [ ] Disable "Previous" on first week, "Next" on last week
- [ ] Add keyboard shortcuts (optional): Arrow keys for navigation

**4.3 Week Indicator Display**
- [ ] Add week counter display: "Week 1 of 4"
- [ ] Show date range for current week: "Nov 3 - Nov 9"
- [ ] Add visual indicator (dots, progress bar) for multiple weeks
- [ ] Style to fit within control panel or above main canvas

**4.4 URL State Management (Optional)**
- [ ] Add URL query parameter for current week: `?week=2`
- [ ] Sync `currentWeekIndex` with URL on navigation
- [ ] Allow direct linking to specific weeks
- [ ] Handle browser back/forward navigation

**Deliverable:** Functional week-by-week pagination UI with navigation controls

---

## Week 5: Enhanced Features & UX Improvements

### Tasks

**5.1 Week Overview/Thumbnail View**
- [ ] Create mini calendar view showing all weeks
- [ ] Display thumbnail preview of each week's schedule
- [ ] Make thumbnails clickable to jump to specific week
- [ ] Highlight current week in overview

**5.2 Print Options for Multi-Week**
- [ ] Add print option: "Print Current Week" (existing behavior)
- [ ] Add print option: "Print All Weeks" (multi-page PDF)
- [ ] Create print dialog with week selection checkboxes
- [ ] Configure CSS `@page` rules for multi-page printing
- [ ] Test print output with various page counts

**5.3 Data Persistence**
- [ ] Store parsed schedule data in browser localStorage/sessionStorage
- [ ] Auto-save on successful PDF parse
- [ ] Add "Load Last Uploaded PDF" button
- [ ] Clear stored data on new upload
- [ ] Add expiration/timestamp to cached data

**5.4 Comparison with Text Input**
- [ ] Maintain both input methods: text input AND PDF upload
- [ ] Add toggle/tab UI: "Text Input" vs "PDF Upload"
- [ ] Ensure both methods write to same data structure
- [ ] Allow switching between methods without losing data

**Deliverable:** Polished multi-week PDF experience with enhanced features

---

## Week 6: Testing, Error Handling & Edge Cases

### Tasks

**6.1 Comprehensive Testing**
- [ ] Test with various PDF formats: text-based, scanned images (OCR)
- [ ] Test with different schedule layouts: tables, lists, paragraphs
- [ ] Test with edge cases: empty weeks, missing days, unusual date formats
- [ ] Test multi-week PDFs: 2, 4, 8, 12+ weeks
- [ ] Performance test: large PDFs (50+ pages)

**6.2 Error Handling & Validation**
- [ ] Add detailed error messages for common failure scenarios:
  - "PDF has no extractable text (might be scanned image)"
  - "Could not detect week boundaries"
  - "Parsing failed - schedule format not recognized"
- [ ] Implement retry mechanism for transient OpenAI API failures
- [ ] Add manual correction UI: let user edit parsed data before display
- [ ] Validate week continuity: warn if dates are non-sequential

**6.3 Accessibility & Usability**
- [ ] Add ARIA labels to file input and navigation buttons
- [ ] Ensure keyboard navigation works for pagination
- [ ] Add loading indicators during PDF processing
- [ ] Improve mobile responsiveness for control panel
- [ ] Add tooltips/help text for file upload requirements

**6.4 Documentation**
- [ ] Update README with PDF upload instructions
- [ ] Document supported PDF formats and limitations
- [ ] Add example PDFs to repository (optional)
- [ ] Create user guide for uploading schedules

**Deliverable:** Production-ready feature with comprehensive error handling

---

## Week 7: Optimization & Advanced Features (Optional)

### Tasks

**7.1 Performance Optimization**
- [ ] Add client-side PDF parsing using `pdf.js` (reduce server load)
- [ ] Implement caching for repeated uploads of same file
- [ ] Optimize OpenAI API calls: batch parse multiple weeks in one call
- [ ] Add progress indicators for large PDFs (streaming updates)

**7.2 Advanced PDF Parsing**
- [ ] Support scanned PDFs with OCR (integrate Tesseract.js or cloud OCR)
- [ ] Implement table detection for structured schedule tables
- [ ] Handle multi-column layouts
- [ ] Detect and preserve formatting (bold, colors) from PDF

**7.3 Export & Sharing**
- [ ] Add "Download Week as PDF" button (export rendered graphic)
- [ ] Generate shareable links with embedded schedule data
- [ ] Add "Email Week" functionality
- [ ] Create thumbnail export for social media sharing

**7.4 Admin Features**
- [ ] Add schedule template library (pre-defined week structures)
- [ ] Implement schedule comparison: diff between weeks
- [ ] Add bulk operations: apply changes to all weeks
- [ ] Create schedule history/versioning

**Deliverable:** Advanced features for power users

---

## Technical Considerations

### PDF Parsing Options

**Option 1: Server-side with `pdfreader` (current dependency)**
- ✅ Already installed
- ✅ Works server-side (secure)
- ❌ Limited to text extraction only (no OCR)
- ❌ Requires server resources

**Option 2: Client-side with `pdf.js`**
- ✅ Reduces server load
- ✅ Works offline
- ✅ Better performance for large files
- ❌ Requires additional dependency
- ❌ Client-side processing limits

**Option 3: Hybrid approach**
- Extract text client-side with `pdf.js`
- Send extracted text to server for parsing with OpenAI
- Best of both worlds

### Data Flow Architecture

```
PDF File
  ↓
Upload (client)
  ↓
Extract Text (server: pdfreader OR client: pdf.js)
  ↓
Preprocess Text (clean formatting)
  ↓
Detect Week Boundaries
  ↓
For each week segment:
  ↓
  Parse with OpenAI (existing WeeklyScheduleSchema)
  ↓
  Validate structure
  ↓
Aggregate into MultiWeekSchedule
  ↓
Return to client
  ↓
Store in component state
  ↓
Display with pagination (currentWeekIndex)
```

### Alternative Parsing Strategy

Instead of relying on OpenAI for every PDF, consider:
1. Pattern matching for common schedule formats (faster, cheaper)
2. Use OpenAI only as fallback for complex/ambiguous formats
3. Allow user to select "PDF Format Template" if known

---

## Dependencies to Add

```json
{
  "pdf.js": "^4.0.0",           // Client-side PDF parsing (optional)
  "date-fns": "^3.0.0",         // Date manipulation and formatting
  "zod": "^4.1.12"              // Already installed, ensure compatible version
}
```

---

## Environment Variables

No new environment variables required (reuse existing `OPENAI_API_KEY`).

Optional:
- `MAX_PDF_SIZE`: Maximum file size in MB
- `MAX_WEEKS_PER_PDF`: Limit multi-week processing

---

## Testing Checklist

- [ ] Single-week PDF upload and display
- [ ] Multi-week PDF upload and pagination
- [ ] Edge case: PDF with no parseable text
- [ ] Edge case: PDF with missing days/weeks
- [ ] Edge case: Non-sequential dates
- [ ] Performance: 20+ week PDF
- [ ] Browser compatibility: Chrome, Firefox, Safari
- [ ] Mobile responsiveness
- [ ] Print output: single week, multiple weeks
- [ ] Accessibility: keyboard navigation, screen readers

---

## Success Metrics

- **Functional**: PDF upload → parse → paginate → display works end-to-end
- **Accurate**: Parsed data matches original PDF content (95%+ accuracy)
- **Performant**: PDF processing completes in <10 seconds for typical schedules
- **Usable**: Users can navigate between weeks easily with clear indicators
- **Robust**: Handles errors gracefully with helpful messages

---

## Notes

- Maintain backward compatibility with text input method
- Consider adding PDF upload as primary method if successful
- Future enhancement: Allow editing parsed data before display
- Consider versioning schedule data format for future changes
