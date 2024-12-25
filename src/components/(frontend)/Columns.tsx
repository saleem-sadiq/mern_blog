/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Define the Blog type
export type Blog = {
  id: number;
  name: string;
  description: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  status: 0 | 1;
};

// Update the Add button to reference the blogs
export const addButton = {
  name: "Add Blog",
  link: "/admin/blog/add_blog",
};

type ActionCellProps = {
  prop: Blog;
  basePath: string;
};

// Function to handle action (edit/delete) for each blog
export const ActionProp: FC<ActionCellProps> = ({ prop, basePath }) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api${basePath}${prop.id}/delete`, {
        method: "POST",
      });

      if (response.ok) {
        toast.success("Blog deleted successfully!");
        setOpen(false);
        window.location.reload();
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to delete blog");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the blog");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="space-x-2">
        <Button variant="default">
          <Link href={`${basePath}${prop.id}/edit_blog`}>Edit</Link>
        </Button>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Delete
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete the blog {prop.name}?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const ActionCell: FC<ActionCellProps> = ({ prop, basePath }) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
        try {
          const response = await fetch(`/api${basePath}${prop.id}/delete`, {
            method: "POST",
          });

          if (response.ok) {
            toast.success("Blog deleted successfully!");
            setOpenDeleteDialog(false);
            window.location.reload();
          } else {
            const data = await response.json();
            toast.error(data.message || "Failed to delete blog");
          }
        } catch (error) {
          toast.error("An error occurred while deleting the blog");
        } finally {
          setIsDeleting(false);
        }
  };

  const handleOpenDeleteDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDeleteDialog(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" id="deleteDialog">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `${basePath}${prop.id}/edit_blog`;
            }}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenDeleteDialog}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={openDeleteDialog}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            handleCloseDeleteDialog();
          }
        }}
      >
        <DialogOverlay />
        <DialogContent id="deleteDialogBody">
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete {prop.name}?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDelete}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={(e) => {
                handleDelete(e);
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const columns: ColumnDef<Blog>[] = [
  {
    accessorKey: "name",
    header: "Blog Title",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="truncate max-w-[150px]"
              data-tooltip-target="tooltip-animation"
            >
              {row.original.description}
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-blackfade2 text-white">
            <p>{row.original.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "image_url",
    header: "Image",
    cell: ({ row }) =>
      row.original.image_url ? (
        <Image
          src={row.original.image_url}
          alt={row.original.name}
          width={1000}
          height={1000}
          className="rounded-md w-16 h-16"
        />
      ) : (
        "No Image"
      ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="bg-transparent p-0 m-0 text-gray-500 hover:bg-transparent"
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span
          className={`px-2 py-1 rounded-full text-sm font-medium ${
            status == 1
              ? "text-green-700 bg-green-100"
              : "text-red-700 bg-red-100"
          }`}
        >
          {status == 1 ? "Published" : "Draft"}
        </span>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
  },
  {
    accessorKey: "action",
    header: "Action",
    id: "actions",
    cell: ({ row }) => (
      <ActionCell prop={row.original} basePath="/admin/blog/" />
    ),
  },
];
