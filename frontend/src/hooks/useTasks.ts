'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { Task, CreateTaskPayload, TaskStatus, TaskPriority } from '@/types/task'

export function useTasks() {
  return useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data } = await api.get<Task[]>('/tasks')
      return data
    },
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => api.post<Task>('/tasks', payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      title,
      description,
      status,
      priority,
    }: {
      id: number
      title: string
      description?: string | null
      status: TaskStatus
      priority: TaskPriority
    }) => api.put<Task>(`/tasks/${id}`, { title, description, status, priority }),
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })
      const prev = queryClient.getQueryData<Task[]>(['tasks'])
      queryClient.setQueryData<Task[]>(['tasks'], (old = []) =>
        old.map((t) => (t.id === vars.id ? { ...t, ...vars } : t))
      )
      return { prev }
    },
    onError: (_, __, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['tasks'], ctx.prev)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: TaskStatus }) =>
      api.patch(`/tasks/${id}/status`, { status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })
      const prev = queryClient.getQueryData<Task[]>(['tasks'])
      queryClient.setQueryData<Task[]>(['tasks'], (old = []) =>
        old.map((t) => (t.id === id ? { ...t, status } : t))
      )
      return { prev }
    },
    onError: (_, __, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['tasks'], ctx.prev)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/tasks/${id}`),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })
      const prev = queryClient.getQueryData<Task[]>(['tasks'])
      queryClient.setQueryData<Task[]>(['tasks'], (old = []) => old.filter((t) => t.id !== id))
      return { prev }
    },
    onError: (_, __, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['tasks'], ctx.prev)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })
}
