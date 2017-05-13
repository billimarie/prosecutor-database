require 'test_helper'

class CasesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get cases_index_url
    assert_response :success
  end

  test "should get show" do
    get cases_show_url
    assert_response :success
  end

  test "should get new" do
    get cases_new_url
    assert_response :success
  end

  test "should get edit" do
    get cases_edit_url
    assert_response :success
  end

end
