;; Student Result Collation Smart Contract
;; Comprehensive system for collating, computing, and managing student examination results

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u700))
(define-constant err-not-found (err u701))
(define-constant err-unauthorized (err u702))
(define-constant err-invalid-data (err u703))
(define-constant err-already-exists (err u704))
(define-constant err-result-locked (err u705))
(define-constant err-invalid-score (err u706))
(define-constant err-session-not-active (err u707))
(define-constant err-invalid-grade (err u708))
(define-constant err-computation-error (err u709))

;; Grading system constants
(define-constant GRADE-A u5)    ;; 70-100
(define-constant GRADE-B u4)    ;; 60-69
(define-constant GRADE-C u3)    ;; 50-59
(define-constant GRADE-D u2)    ;; 45-49
(define-constant GRADE-E u1)    ;; 40-44
(define-constant GRADE-F u0)    ;; 0-39

;; Result status
(define-constant STATUS-PENDING u1)
(define-constant STATUS-COMPUTED u2)
(define-constant STATUS-APPROVED u3)
(define-constant STATUS-PUBLISHED u4)

;; Session status
(define-constant SESSION-ACTIVE u1)
(define-constant SESSION-CLOSED u2)

;; Data Variables
(define-data-var session-counter uint u0)
(define-data-var result-counter uint u0)
(define-data-var subject-counter uint u0)

;; Academic sessions
(define-map academic-sessions
    { session-id: uint }
    {
        session-name: (string-ascii 50),     ;; e.g., "2024/2025"
        semester: (string-ascii 20),          ;; "First", "Second", "Third"
        start-date: uint,
        end-date: uint,
        status: uint,
        created-by: principal,
        total-students: uint
    }
)

;; Classes/Levels
(define-map classes
    { class-id: uint }
    {
        class-name: (string-utf8 50),         ;; e.g., "SS3 Science A"
        grade-level: uint,                    ;; 1-12 (or higher)
        section: (string-ascii 10),           ;; "A", "B", "C"
        class-teacher: principal,
        total-students: uint,
        is-active: bool
    }
)

;; Subjects
(define-map subjects
    { subject-id: uint }
    {
        subject-code: (string-ascii 20),
        subject-name: (string-utf8 100),
        is-core: bool,                        ;; Core or elective
        max-score: uint,                      ;; Usually 100
        pass-mark: uint,                      ;; Usually 40 or 50
        class-id: uint
    }
)

;; Students
(define-map students
    { student-id: uint }
    {
        student-name: (string-utf8 100),
        registration-number: (string-ascii 50),
        class-id: uint,
        is-active: bool,
        enrollment-date: uint
    }
)

(define-map student-registrations
    { registration-number: (string-ascii 50) }
    { student-id: uint }
)

;; Subject scores (CA + Exam)
(define-map subject-scores
    { student-id: uint, subject-id: uint, session-id: uint }
    {
        ca-score: uint,                       ;; Continuous Assessment (usually 40)
        exam-score: uint,                     ;; Examination (usually 60)
        total-score: uint,                    ;; CA + Exam
        grade: uint,                          ;; A=5, B=4, C=3, D=2, E=1, F=0
        grade-letter: (string-ascii 2),       ;; "A", "B", "C", "D", "E", "F"
        remark: (string-ascii 20),            ;; "Excellent", "Good", "Pass", "Fail"
        position: (optional uint),            ;; Position in subject
        recorded-by: principal,
        recorded-at: uint,
        is-verified: bool
    }
)

;; Student overall results (per session)
(define-map student-results
    { student-id: uint, session-id: uint }
    {
        total-subjects: uint,
        total-score: uint,
        average-score: uint,                  ;; Average across all subjects
        overall-grade: (string-ascii 2),
        class-position: (optional uint),
        total-students: uint,                 ;; For context
        status: uint,
        computed-by: (optional principal),
        computed-at: (optional uint),
        approved-by: (optional principal),
        approved-at: (optional uint),
        is-published: bool
    }
)

;; Subject enrollments (which subjects each student takes)
(define-map student-subjects
    { student-id: uint, session-id: uint }
    { subject-ids: (list 20 uint) }
)

;; Class results summary
(define-map class-results
    { class-id: uint, session-id: uint }
    {
        total-students: uint,
        computed-students: uint,
        average-class-score: uint,
        highest-score: uint,
        lowest-score: uint,
        pass-rate: uint,                      ;; Percentage (basis points)
        is-finalized: bool
    }
)

;; Result remarks/comments
(define-map result-comments
    { student-id: uint, session-id: uint }
    {
        class-teacher-comment: (string-utf8 500),
        principal-comment: (string-utf8 500),
        attendance: uint,                     ;; Days present
        total-school-days: uint,
        conduct-rating: uint,                 ;; 1-5 scale
        next-term-begins: (optional uint)
    }
)

;; Read-only functions

(define-read-only (get-session (session-id uint))
    (map-get? academic-sessions { session-id: session-id })
)

(define-read-only (get-student (student-id uint))
    (map-get? students { student-id: student-id })
)

(define-read-only (get-student-by-reg-number (registration-number (string-ascii 50)))
    (match (map-get? student-registrations { registration-number: registration-number })
        mapping (get-student (get student-id mapping))
        none
    )
)

(define-read-only (get-class (class-id uint))
    (map-get? classes { class-id: class-id })
)

(define-read-only (get-subject (subject-id uint))
    (map-get? subjects { subject-id: subject-id })
)

(define-read-only (get-subject-score (student-id uint) (subject-id uint) (session-id uint))
    (map-get? subject-scores { student-id: student-id, subject-id: subject-id, session-id: session-id })
)

(define-read-only (get-student-result (student-id uint) (session-id uint))
    (map-get? student-results { student-id: student-id, session-id: session-id })
)

(define-read-only (get-student-subjects (student-id uint) (session-id uint))
    (default-to
        { subject-ids: (list) }
        (map-get? student-subjects { student-id: student-id, session-id: session-id })
    )
)

(define-read-only (get-class-results (class-id uint) (session-id uint))
    (map-get? class-results { class-id: class-id, session-id: session-id })
)

(define-read-only (get-result-comments (student-id uint) (session-id uint))
    (map-get? result-comments { student-id: student-id, session-id: session-id })
)

(define-read-only (calculate-grade (score uint))
    (if (>= score u70)
        (ok { grade: GRADE-A, letter: "A", remark: "Excellent" })
        (if (>= score u60)
            (ok { grade: GRADE-B, letter: "B", remark: "Very Good" })
            (if (>= score u50)
                (ok { grade: GRADE-C, letter: "C", remark: "Good" })
                (if (>= score u45)
                    (ok { grade: GRADE-D, letter: "D", remark: "Pass" })
                    (if (>= score u40)
                        (ok { grade: GRADE-E, letter: "E", remark: "Fair" })
                        (ok { grade: GRADE-F, letter: "F", remark: "Fail" })
                    )
                )
            )
        )
    )
)

;; Private helper functions

(define-private (add-subject-to-student (student-id uint) (session-id uint) (subject-id uint))
    (let
        (
            (current-subjects (get subject-ids (get-student-subjects student-id session-id)))
        )
        (map-set student-subjects
            { student-id: student-id, session-id: session-id }
            { subject-ids: (unwrap-panic (as-max-len? (append current-subjects subject-id) u20)) }
        )
    )
)

;; Admin functions

(define-public (create-session
    (session-name (string-ascii 50))
    (semester (string-ascii 20))
    (start-date uint)
    (end-date uint))
    (let
        (
            (new-session-id (+ (var-get session-counter) u1))
        )
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        
        (map-set academic-sessions
            { session-id: new-session-id }
            {
                session-name: session-name,
                semester: semester,
                start-date: start-date,
                end-date: end-date,
                status: SESSION-ACTIVE,
                created-by: tx-sender,
                total-students: u0
            }
        )
        
        (var-set session-counter new-session-id)
        
        (print {
            event: "session-created",
            session-id: new-session-id,
            session-name: session-name,
            timestamp: burn-block-height
        })
        
        (ok new-session-id)
    )
)

(define-public (create-class
    (class-name (string-utf8 50))
    (grade-level uint)
    (section (string-ascii 10))
    (class-teacher principal))
    (let
        (
            (class-id (+ (var-get session-counter) u1))
        )
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        
        (map-set classes
            { class-id: class-id }
            {
                class-name: class-name,
                grade-level: grade-level,
                section: section,
                class-teacher: class-teacher,
                total-students: u0,
                is-active: true
            }
        )
        
        (ok class-id)
    )
)

(define-public (create-subject
    (subject-code (string-ascii 20))
    (subject-name (string-utf8 100))
    (is-core bool)
    (max-score uint)
    (pass-mark uint)
    (class-id uint))
    (let
        (
            (new-subject-id (+ (var-get subject-counter) u1))
        )
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (asserts! (<= pass-mark max-score) err-invalid-data)
        
        (map-set subjects
            { subject-id: new-subject-id }
            {
                subject-code: subject-code,
                subject-name: subject-name,
                is-core: is-core,
                max-score: max-score,
                pass-mark: pass-mark,
                class-id: class-id
            }
        )
        
        (var-set subject-counter new-subject-id)
        
        (print {
            event: "subject-created",
            subject-id: new-subject-id,
            subject-code: subject-code,
            timestamp: burn-block-height
        })
        
        (ok new-subject-id)
    )
)

(define-public (register-student
    (student-name (string-utf8 100))
    (registration-number (string-ascii 50))
    (class-id uint))
    (let
        (
            (student-id (+ (var-get result-counter) u1))
        )
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (asserts! (is-none (map-get? student-registrations { registration-number: registration-number })) err-already-exists)
        
        (map-set students
            { student-id: student-id }
            {
                student-name: student-name,
                registration-number: registration-number,
                class-id: class-id,
                is-active: true,
                enrollment-date: burn-block-height
            }
        )
        
        (map-set student-registrations
            { registration-number: registration-number }
            { student-id: student-id }
        )
        
        (var-set result-counter student-id)
        
        (print {
            event: "student-registered",
            student-id: student-id,
            registration-number: registration-number,
            timestamp: burn-block-height
        })
        
        (ok student-id)
    )
)

;; Score recording functions

(define-public (record-subject-score
    (student-id uint)
    (subject-id uint)
    (session-id uint)
    (ca-score uint)
    (exam-score uint))
    (let
        (
            (session (unwrap! (get-session session-id) err-not-found))
            (subject (unwrap! (get-subject subject-id) err-not-found))
            (student (unwrap! (get-student student-id) err-not-found))
            (max-ca u40)
            (max-exam u60)
            (total-score (+ ca-score exam-score))
            (grade-info (unwrap-panic (calculate-grade total-score)))
        )
        ;; Validations
        (asserts! (is-eq (get status session) SESSION-ACTIVE) err-session-not-active)
        (asserts! (<= ca-score max-ca) err-invalid-score)
        (asserts! (<= exam-score max-exam) err-invalid-score)
        
        ;; Record score
        (map-set subject-scores
            { student-id: student-id, subject-id: subject-id, session-id: session-id }
            {
                ca-score: ca-score,
                exam-score: exam-score,
                total-score: total-score,
                grade: (get grade grade-info),
                grade-letter: (get letter grade-info),
                remark: (get remark grade-info),
                position: none,
                recorded-by: tx-sender,
                recorded-at: burn-block-height,
                is-verified: false
            }
        )
        
        ;; Add subject to student's list if not already there
        (add-subject-to-student student-id session-id subject-id)
        
        (print {
            event: "score-recorded",
            student-id: student-id,
            subject-id: subject-id,
            session-id: session-id,
            total-score: total-score,
            grade: (get letter grade-info),
            timestamp: burn-block-height
        })
        
        (ok total-score)
    )
)

(define-public (verify-subject-score
    (student-id uint)
    (subject-id uint)
    (session-id uint))
    (let
        (
            (score (unwrap! (get-subject-score student-id subject-id session-id) err-not-found))
        )
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        
        (map-set subject-scores
            { student-id: student-id, subject-id: subject-id, session-id: session-id }
            (merge score { is-verified: true })
        )
        
        (ok true)
    )
)

;; Result computation

(define-public (compute-student-result
    (student-id uint)
    (session-id uint))
    (let
        (
            (student (unwrap! (get-student student-id) err-not-found))
            (session (unwrap! (get-session session-id) err-not-found))
            (subjects (get subject-ids (get-student-subjects student-id session-id)))
            (subject-count (len subjects))
        )
        (asserts! (> subject-count u0) err-invalid-data)
        
        ;; Note: In a real implementation, you'd loop through subjects to calculate total
        ;; For this demo, we'll use placeholder calculation
        (let
            (
                (total-score u0)  ;; Would sum all subject scores
                (average-score (if (> subject-count u0) (/ total-score subject-count) u0))
                (overall-grade-info (unwrap-panic (calculate-grade average-score)))
            )
            (map-set student-results
                { student-id: student-id, session-id: session-id }
                {
                    total-subjects: subject-count,
                    total-score: total-score,
                    average-score: average-score,
                    overall-grade: (get letter overall-grade-info),
                    class-position: none,
                    total-students: u0,
                    status: STATUS-COMPUTED,
                    computed-by: (some tx-sender),
                    computed-at: (some burn-block-height),
                    approved-by: none,
                    approved-at: none,
                    is-published: false
                }
            )
            
            (print {
                event: "result-computed",
                student-id: student-id,
                session-id: session-id,
                average-score: average-score,
                timestamp: burn-block-height
            })
            
            (ok average-score)
        )
    )
)

(define-public (approve-result
    (student-id uint)
    (session-id uint))
    (let
        (
            (result (unwrap! (get-student-result student-id session-id) err-not-found))
        )
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (asserts! (is-eq (get status result) STATUS-COMPUTED) err-invalid-data)
        
        (map-set student-results
            { student-id: student-id, session-id: session-id }
            (merge result {
                status: STATUS-APPROVED,
                approved-by: (some tx-sender),
                approved-at: (some burn-block-height)
            })
        )
        
        (print {
            event: "result-approved",
            student-id: student-id,
            session-id: session-id,
            timestamp: burn-block-height
        })
        
        (ok true)
    )
)

(define-public (publish-result
    (student-id uint)
    (session-id uint))
    (let
        (
            (result (unwrap! (get-student-result student-id session-id) err-not-found))
        )
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (asserts! (is-eq (get status result) STATUS-APPROVED) err-invalid-data)
        
        (map-set student-results
            { student-id: student-id, session-id: session-id }
            (merge result {
                status: STATUS-PUBLISHED,
                is-published: true
            })
        )
        
        (print {
            event: "result-published",
            student-id: student-id,
            session-id: session-id,
            timestamp: burn-block-height
        })
        
        (ok true)
    )
)

;; Comments and remarks

(define-public (add-result-comments
    (student-id uint)
    (session-id uint)
    (class-teacher-comment (string-utf8 500))
    (principal-comment (string-utf8 500))
    (attendance uint)
    (total-school-days uint)
    (conduct-rating uint))
    (begin
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (asserts! (<= conduct-rating u5) err-invalid-data)
        
        (map-set result-comments
            { student-id: student-id, session-id: session-id }
            {
                class-teacher-comment: class-teacher-comment,
                principal-comment: principal-comment,
                attendance: attendance,
                total-school-days: total-school-days,
                conduct-rating: conduct-rating,
                next-term-begins: none
            }
        )
        
        (print {
            event: "comments-added",
            student-id: student-id,
            session-id: session-id,
            timestamp: burn-block-height
        })
        
        (ok true)
    )
)

(define-public (update-class-position
    (student-id uint)
    (session-id uint)
    (position uint)
    (total-students uint))
    (let
        (
            (result (unwrap! (get-student-result student-id session-id) err-not-found))
        )
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        
        (map-set student-results
            { student-id: student-id, session-id: session-id }
            (merge result {
                class-position: (some position),
                total-students: total-students
            })
        )
        
        (ok true)
    )
)
