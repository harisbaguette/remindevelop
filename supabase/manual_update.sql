-- 1. links 테이블에 image_url 컬럼 추가 (이미지 미리보기용)
ALTER TABLE links ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2. links 테이블에 type 컬럼 추가 (링크/텍스트 구분용)
do $$ 
begin 
  if not exists (select 1 from information_schema.columns where table_name = 'links' and column_name = 'type') then
    alter table links add column type text default 'link' check (type in ('link', 'text'));
  end if; 
end $$;

-- 3. 휴지통 자동 비우기 함수 (30일 지난 항목 영구 삭제)
create or replace function delete_old_trash()
returns void
language plpgsql
security definer
as $$
begin
  delete from links
  where status = 'trash'
  and updated_at < now() - interval '30 days';
end;
$$;
