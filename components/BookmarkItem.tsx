'use client'

export default function BookmarkItem({ bookmark, onDelete }: any) {
  const handleDelete = () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this bookmark?'
    )

    if (!confirmDelete) return

    onDelete(bookmark.id)
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center ">
      <div>
        <h3 className="font-medium">{bookmark.title}</h3>
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          {bookmark.url}
        </a>
      </div>

      <button
        onClick={handleDelete}
        className="text-red-500 text-sm hover:text-red-700"
      >
        Delete
      </button>
    </div>
  )
}
