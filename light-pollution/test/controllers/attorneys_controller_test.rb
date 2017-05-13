require 'test_helper'

class AttorneysControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get attorneys_index_url
    assert_response :success
  end

  test "should get show" do
    get attorneys_show_url
    assert_response :success
  end

  test "should get new" do
    get attorneys_new_url
    assert_response :success
  end

  test "should get edit" do
    get attorneys_edit_url
    assert_response :success
  end

end
