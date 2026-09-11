<div wire:ignore>
    <textarea
        x-data
        x-ref="editor"
        x-init="
            const initEditor = () => {
                if (window.tinymce) {
                    tinymce.init({
                        target: $refs.editor,
                        height: 400,
                        paste_data_images: false,
                        automatic_uploads: true,

                        // `blockquote` is a core toolbar button, not a plugin — listing it
                        // here makes TinyMCE fetch a non-existent plugins/blockquote/plugin.min.js.
                        plugins: [
                            'accordion', 'anchor', 'autolink', 'charmap', 'code', 'codesample', 'emoticons',
                            'image', 'link', 'lists', 'media', 'preview', 'searchreplace', 'table',
                        ],

                        toolbar: 'undo redo | blocks | bold italic underline | blockquote| image | accordion | code preview | link |  align numlist bullist ',

                        extended_valid_elements: 'blockquote[class],p[class],span[class]',

                        tinycomments_mode: 'embedded',

                        tinycomments_author: 'Author name',

                        verify_html: false,

                        valid_elements: '*[*]',

                        automatic_uploads: true,

                        images_upload_url: '/admin/tinymce/upload',

                        image_dimensions: false,

                        file_picker_types: 'image',

                        style_formats: [
                            {
                                title: 'Quote styles',
                                items: [
                                    { title: 'Default', block: 'blockquote' },
                                    { title: 'Highlighted Quote', block: 'blockquote', classes: 'quote-highlight' },
                                    { title: 'Info Quote', block: 'blockquote', classes: 'quote-info' }
                                ]
                            }
                        ],

                        file_picker_callback: function (cb, value, meta) {
                            if (meta.filetype === 'image') {
                                const input = document.createElement('input')
                                input.setAttribute('type', 'file')
                                input.setAttribute('accept', 'image/*')

                                input.onchange = function () {
                                    const file = this.files[0]

                                    const formData = new FormData();
                                    formData.append('file', file);

                                    const reader = new FileReader()

                                    reader.onload = function () {
                                        const id = 'blobid' + (new Date()).getTime()
                                        const blobCache = tinymce.activeEditor.editorUpload.blobCache
                                        const base64 = reader.result.split(',')[1]
                                        const blobInfo = blobCache.create(id, file, base64)

                                        blobCache.add(blobInfo)

                                        cb(blobInfo.blobUri(), { title: file.name })
                                    }

                                    reader.readAsDataURL(file)
                                }

                                input.click()
                            }
                        },

                        setup: function (editor) {
                           editor.ui.registry.addButton('accordion', {
                                text: 'Accordion',
                                onAction: function () {
                                    editor.insertContent(`
                                        <details>
                                            <summary>Accordion title</summary>
                                            <p>Accordion content...</p>
                                        </details>
                                    `)
                                }
                            })

                            editor.ui.registry.addButton('blockquote', {
                                text: 'Quote',
                                icon: 'quote',
                                onAction: function () {
                                    editor.insertContent(`
                                        <blockquote>
                                           <p>Your quote here...</p>
                                        </blockquote>
                                    `)
                                }
                            })

                            editor.on('init', function () {
                                editor.setContent(@this.get('{{ $getStatePath() }}') ?? '')
                            })

                            editor.on('change keyup', function () {
                                @this.set('{{ $getStatePath() }}', editor.getContent())
                            })
                        }
                    })
                }
            }

            initEditor()
        "
    ></textarea>
</div>

 @push('scripts')
    {{-- TinyMCE 6.8.6 community (GPL) лежит в public/js/tinymce и намеренно не
         грузится с cdn.tiny.cloud: облачная сборка привязана к списку
         разрешённых доменов в чужом кабинете Tiny, и на каждом новом домене
         редактор встречает контент-менеджера жёлтой плашкой. --}}
    <script src="{{ asset('js/tinymce/tinymce.min.js') }}"></script>
@endpush
