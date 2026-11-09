drop policy if exists "Admins delete orders" on public.orders;
create policy "Admins delete orders" on public.orders
for delete using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

drop policy if exists "Admins delete order items" on public.order_items;
create policy "Admins delete order items" on public.order_items
for delete using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);
