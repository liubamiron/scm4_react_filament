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
                        plugins: [
                            'link', 'lists', 'table', 'code', 'image', 'preview'
                        ],

                        toolbar: 'undo redo | blocks | bold italic underline | image | code preview',

                        automatic_uploads: true,

                        images_upload_url: '/admin/tinymce/upload',

                        file_picker_types: 'image',

                        file_picker_callback: function (cb, value, meta) {
                            if (meta.filetype === 'image') {
                                const input = document.createElement('input')
                                input.setAttribute('type', 'file')
                                input.setAttribute('accept', 'image/*')

                                input.onchange = function () {
                                    const file = this.files[0]
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
    <script src="https://cdn.tiny.cloud/1/dp8gi9tixz1xkvbr5hub3i4azl46kccgibxe7cev1gsaz684/tinymce/6/tinymce.min.js"></script>
@endpush
